import { ChromeStorageKeys } from 'models/github'
import Notification, {
  NotificationStatus,
  UpdateReason,
} from 'models/github/Notification'
import Reason from 'models/github/Reason'
import NotificationEntity from 'models/response/Notification'
import { storageGet, storageSet } from './chrome.service'
export default class NotificationService {
  private static THREE_DAYS: number = 1000 * 60 * 60 * 24 * 3
  private static AGE_THERESHOLD: number =
    new Date().getTime() - NotificationService.THREE_DAYS
  private static reasonOrder: Record<Reason, number> = {
    [Reason.MINE]: 0,
    [Reason.REVIEWING]: 1,
    [Reason.OTHERS]: 2,
  }

  /**
   * Analyzes a Notification and decides if its still relevant
   *
   * @param notif The Notification in question
   * @returns true | false
   */
  static isRelevant(notif: Notification): boolean {
    const hasUpdate: boolean = notif.update !== UpdateReason.NO_UPDATE
    const isOpen: boolean = notif.pr?.state === 'open'
    return (
      isOpen &&
      (notif.unread ||
        (hasUpdate && notif.age > NotificationService.AGE_THERESHOLD))
    )
  }

  /**
   * Compares a Notification with the update to verify what was updated.
   *
   * @param base   The base Notification
   * @param update The updated data
   * @returns The most relevant update
   */
  static async applyUpdate(
    base: Notification,
    updateRaw: NotificationEntity
  ): Promise<Notification> {
    const update: Notification = new Notification(updateRaw)
    let reason: UpdateReason = UpdateReason.NO_UPDATE

    if (base.age === update.age) return base

    try {
      await update.loadPRData()
    } catch (err) {
      console.log(err)
    }

    if (base.pr?.comments !== update.pr?.comments) reason = UpdateReason.COMMENT
    if (base.pr?.draft && !update.pr?.draft) reason = UpdateReason.UNDRAFT
    if (!base.pr?.draft && update.pr?.draft) reason = UpdateReason.DRAFT
    if (base.pr?.merge.base !== update.pr?.merge.base)
      reason = UpdateReason.BASE_CHANGE
    if (base.pr?.state !== update.pr?.state) reason = UpdateReason.STATE_CHANGE
    if (base.age !== update.age) reason = UpdateReason.OTHER
    if (update.unread) reason = UpdateReason.READ

    update.update = reason

    return update
  }

  /**
   * Packs a Notification array for storage.
   *
   * @param collection The Notifications to store
   * @returns A stringified store of the Notifications
   */
  static package(collection: Notification[]): string {
    return JSON.stringify(
      collection.reduce((store: any[], item: Notification) => {
        if (NotificationService.isRelevant(item)) store.push({ ...item })
        // store.push({ ...item })
        return store
      }, [])
    )
  }

  /**
   * Fetches the stored notifications
   *
   * @returns Notifications array
   */
  static async getStoredNotifications(): Promise<Notification[]> {
    const store: string =
      (await storageGet(ChromeStorageKeys.NOTIFICATIONS)) ?? ''

    try {
      const storedData: any[] = store ? JSON.parse(store) : []
      return storedData.map(storeItem => new Notification(storeItem))
    } catch (err) {
      console.warn(err)
    }
    return []
  }

  /**
   * Compares the response from the API to the values on the store
   * and identifies what has been updated on each item.
   *
   * Refreshes the stored data to reflect the updates.
   *
   * Returns the updated Notification array.
   *
   * @param updates The unparsed response from Notification API
   * @returns       The updated Notification array
   */
  static async unpackAndUpdate(
    updates: NotificationEntity[]
  ): Promise<Notification[]> {
    const storedData: Notification[] =
      await NotificationService.getStoredNotifications()
    const collectionFromStore: Record<string, Notification> = storedData.reduce(
      (stored, notif) => ({
        ...stored,
        [notif.id]: notif,
      }),
      {}
    )

    const collection: Notification[] = await NotificationService.fetchOneByOne(
      updates,
      [],
      collectionFromStore
    )
    const newStore: string = NotificationService.package(collection)

    await storageSet(ChromeStorageKeys.NOTIFICATIONS, newStore)

    return collection
  }

  /**
   * Sorts by Reason and Title. Also generates a NotifactionStatus with
   * the count of unreads for each reason
   *
   * @param collection The Notification array
   * @returns          The sorted Notifactions and NotificationStatus
   */
  static sortAndCount(
    collection: Notification[]
  ): [Notification[], NotificationStatus] {
    const status: NotificationStatus = {}
    const ordered: Notification[] = collection.sort((notif1, notif2) => {
      let rWeigth1: number = NotificationService.reasonOrder[notif1.reason]
      let rWeigth2: number = NotificationService.reasonOrder[notif2.reason]

      if (rWeigth1 !== rWeigth2) {
        return rWeigth1 > rWeigth2 ? 1 : -1
      } else {
        return notif1.age < notif2.age ? 1 : -1
      }
    })

    ordered.forEach(notif => {
      if (notif.unread) {
        let count: number = status[notif.reason] ?? 0
        count++
        status[notif.reason] = count
      }
    })

    return [ordered, status]
  }

  /**
   * Processes a list of raw Notifications, compares the new data with the stored
   * one and outlines the most relevant update since the last sync.
   *
   * This recursive function sends 1 request at the time instead of bulk-request
   * to avoid Github API restrictions
   *
   * @param pending             The list of pending items
   * @param finished            The list of finished items
   * @param collectionFromStore The stored data to compare
   * @returns                   A list of Notifications with the updates outlined
   */
  private static async fetchOneByOne(
    pending: NotificationEntity[],
    finished: Notification[],
    collectionFromStore: Record<string, Notification>
  ): Promise<Notification[]> {
    const next: NotificationEntity | undefined = pending.shift()
    let newNotification: Notification

    if (!next) {
      return finished
    }

    const base: Notification | undefined = collectionFromStore[next.id]

    newNotification = !base
      ? new Notification(next)
      : await NotificationService.applyUpdate(base, next)

    await newNotification.loadPRData()

    if (NotificationService.isRelevant(newNotification)) {
      console.log('RELEVANT', newNotification.title)
      finished.push(newNotification)
    } else {
      console.log('NOT RELEVANT', newNotification.title)
    }

    return NotificationService.fetchOneByOne(
      pending,
      finished,
      collectionFromStore
    )
  }
}
