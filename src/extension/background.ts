import { onMessage, onUnload, setBadge } from 'services/chrome.service'
import { BgActions, BgMessage, BgResponse } from 'models/bg'
import { getAccessToken, getNotifications } from 'services/api.service'
import Notification, { NotificationStatus } from 'models/github/Notification'
import Reason from 'models/github/Reason'

function statusToBadge(status: NotificationStatus): string {
  const result = []
  let others = 0
  if (status[Reason.MINE]) result.push(status[Reason.MINE])
  others += status[Reason.REVIEWING] ?? 0
  others += status[Reason.OTHERS] ?? 0
  if (others) result.push(others)
  return result.join('/')
}

onMessage(async (msg: BgMessage, respond: Function): Promise<void> => {
  try {
    switch (msg.type) {
      case BgActions.NOTIFICATIONS:
        const [data, status]: [Notification[], NotificationStatus] =
          await getNotifications()
        const notifications: BgResponse<Notification[]> = {
          data,
        }
        setBadge(statusToBadge(status))
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

onUnload(() => {
  setBadge('')
})
