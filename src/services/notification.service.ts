import { ChromeStorageKeys } from 'models/github'
import Notification, { UpdateReason } from 'models/github/Notification'
import NotificationEntity from 'models/response/Notification'
import { storageGet, storageSet } from './chrome.service'

export default class NotificationService {
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

    if (base.lastUpdate === update.lastUpdate) return base

    try {
      await update.loadPRData()
    } catch (err) {
      console.log(err)
    }

    if (!base.pr?.merge.merged && update.pr?.merge.merged)
      reason = UpdateReason.MERGE
    if (base.pr?.comments !== update.pr?.comments) reason = UpdateReason.COMMENT
    if (base.pr?.draft && !update.pr?.draft) reason = UpdateReason.UNDRAFT
    if (!base.pr?.draft && update.pr?.draft) reason = UpdateReason.DRAFT
    if (base.pr?.merge.base !== update.pr?.merge.base)
      reason = UpdateReason.BASE_CHANGE
    if (base.pr?.state !== update.pr?.state) reason = UpdateReason.STATE_CHANGE
    if (
      base.lastUpdate !== update.lastUpdate ||
      base.pr?.lastUpdate !== update.pr?.lastUpdate
    )
      reason = UpdateReason.OTHER
    if (base.unread !== update.unread) reason = UpdateReason.READ

    reason = UpdateReason.NO_UPDATE

    if (reason !== UpdateReason.NO_UPDATE) {
      update.update = reason
      return reason
    } else {
      base.update = reason
      return base
    }
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
        store.push({ ...item })
        return store
      }, [])
    )
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
    const store: string =
      (await storageGet(ChromeStorageKeys.NOTIFICATIONS)) ?? ''
    const collectionFromStore: Record<string, Notification> = {}
    let collectionRaw: any[] = []

    try {
      collectionRaw = store ? JSON.parse(store) : []
    } catch (err) {
      throw new Error('Stored data is corrupted')
    }

    collectionRaw.forEach(data => {
      try {
        const notif: Notification = new Notification(data)
        collectionFromStore[notif.id] = notif
      } catch (err) {
        console.log(err)
      }
    })

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

    if (!next) return finished

    const base: Notification | undefined = collectionFromStore[next.id]

    if (!base) {
      newNotification = await new Notification(next).loadPRData()
    } else {
      newNotification = await NotificationService.applyUpdate(base, next)
    }

    finished.push(newNotification)

    return NotificationService.fetchOneByOne(
      pending,
      finished,
      collectionFromStore
    )
  }
}
