import { onMessage, onUnload, setBadge } from 'services/chrome.service'
import { BgActions, BgMessage, BgResponse } from 'models/bg'
import { getAccessToken, getNotifications } from 'services/api.service'
import Notification from 'models/github/Notification'
import { Status } from 'models/github'

onMessage(async (msg: BgMessage, respond: Function): Promise<void> => {
  try {
    switch (msg.type) {
      case BgActions.NOTIFICATIONS:
        console.log('Get Notifications')
        const res: Notification[] = await getNotifications()
        const notifications: BgResponse<Notification[]> = {
          data: res,
        }
        respond(notifications)
        break
      case BgActions.AUTH:
        console.log('Get Token')
        const token: string = await getAccessToken(msg.message)
        const accessToken: BgResponse<string> = {
          data: token,
        }
        respond(accessToken)
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
  setBadge(Status.READY)
})
