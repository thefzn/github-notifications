import { onMessage, onUnload, setBadge } from 'services/chrome.service'
import { BgActions, BgMessage } from 'models/bg'
import { getAccessToken } from 'services/api.service'

onMessage(async (msg: BgMessage, respond: Function) => {
  console.log('Message', msg.type)
  switch (msg.type) {
    case BgActions.AUTH:
      const res: string = await getAccessToken(msg.message)
      respond(res)
  }
})

// onUnload(() => {
//   setBadge(STATUS.IDLE);
// });
