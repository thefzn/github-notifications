import { BgActions } from 'models/bg'
import { useEffect } from 'react'
import { sendMessage } from 'services/chrome.service'

export default function useBadge(text: string) {
  useEffect(() => {
    sendMessage({
      type: BgActions.BADGE,
      message: text,
    })
  }, [text])
}
