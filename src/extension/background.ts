import { onMessage, onLoad, setBadge } from 'services/chrome.service'
import { BgActions, BgMessage, BgResponse } from 'models/bg'
import { getAccessToken, getNotifications } from 'services/api.service'
import Notification, { NotificationStatus } from 'models/github/Notification'
import Reason from 'models/github/Reason'
import NotificationService from 'services/notification.service'

let timeout: ReturnType<typeof setTimeout>
const HEARTBEAT_DELAY: number = 1000 * 60 * 5 // Every 5 mins

function statusToBadge(status: NotificationStatus): string {
  const result = []
  let others = 0
  if (status[Reason.MINE]) result.push(status[Reason.MINE])
  others += status[Reason.REVIEWING] ?? 0
  others += status[Reason.OTHERS] ?? 0
  if (others) result.push(others)
  return result.join('/')
}

/**
 *
 * @returns
 */
async function refreshNotifications(): Promise<Notification[]> {
  setBadge(' ...')

  const data: Notification[] = await getNotifications()
  const status: NotificationStatus = NotificationService.count(data)

  setBadge(statusToBadge(status))

  return data
}

/**
 * Checks every certain time the status of the Notifications
 */
async function heartbeat() {
  clearTimeout(timeout)

  await refreshNotifications()

  timeout = setTimeout(() => heartbeat(), HEARTBEAT_DELAY)
}

onMessage(async (msg: BgMessage, respond: Function): Promise<void> => {
  try {
    switch (msg.type) {
      case BgActions.NOTIFICATIONS:
        const data: Notification[] = await refreshNotifications()
        const notifications: BgResponse<Notification[]> = {
          data,
        }
        respond(notifications)
        break
      case BgActions.AUTH:
        const token: string = await getAccessToken(msg.message)
        const accessToken: BgResponse<string> = {
          data: token,
        }
        respond(accessToken)
        break
      case BgActions.BADGE:
        setBadge(msg.message || '')
        break
      default:
        const error = 'Invalid action'
        respond({ error })
    }
  } catch (err) {
    if (err instanceof Error) {
      respond({ error: err.message })
    } else {
      respond({ error: err })
    }
  }
})

heartbeat()
