import { useEffect, useState } from 'react'
import Notification from 'models/github/Notification'
import { getQuery, objectToForm } from 'services/utils.service'
import { sendMessage, storageGet, storageSet } from 'services/chrome.service'
import {
  GITHUB_ENDPOINT,
  ChromeStorage,
  ChromeStorageKeys,
} from 'models/github'
import { BgActions, BgMessage } from 'models/bg'

const useGithubAPI = (clientId: string, extensionId: string) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [error, setError] = useState<Error>()
  const [ready, setReady] = useState<boolean>(false)

  useEffect(() => {
    if (accessToken) {
      const message: BgMessage = {
        type: BgActions.NOTIFICATIONS,
      }
      sendMessage(message)
        .then(data => {
          setReady(true)
          setNotifications(data)
        })
        .catch(setError)
    }
  }, [accessToken])

  useEffect(() => {
    const { code }: Record<string, string> = getQuery()

    if (code) {
      const message: BgMessage = {
        type: BgActions.AUTH,
        message: code,
      }
      sendMessage(message)
        .then(token => {
          storageSet(ChromeStorageKeys.ACCESS_TOKEN, token)
          setAccessToken(token)
        })
        .catch(setError)
    } else {
      storageGet(ChromeStorageKeys.ACCESS_TOKEN).then(accessToken => {
        if (!accessToken) {
          const params: string = objectToForm({
            client_id: clientId,
            scope: 'notifications',
            redirect_uri: `chrome-extension://${extensionId}/index.html`,
          })

          window.location.href = `${GITHUB_ENDPOINT.AUTH}?${params}`
        } else {
          setAccessToken(accessToken)
        }
      })
    }
  }, [])

  return { notifications, ready, error }
}

export default useGithubAPI
