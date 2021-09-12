import { useEffect, useState } from 'react'
import Notification from 'models/github/Notification'
import { getQuery, objectToForm } from 'services/utils.service'
import { sendMessage, storageGet, storageSet } from 'services/chrome.service'
import { Status, GITHUB_ENDPOINT, ChromeStorageKeys } from 'models/github'
import { BgActions, BgMessage } from 'models/bg'

export type GithubAPIResults = {
  notifications: Notification[]
  status: Status
  error?: Error
  loginUrl: string
}

const useGithubAPI = (
  clientId: string,
  extensionId: string
): GithubAPIResults => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [error, setError] = useState<Error>()
  const [status, setStatus] = useState<Status>(Status.LOADING)
  const params: string = objectToForm({
    client_id: clientId,
    scope: 'notifications, repo',
    redirect_uri: `chrome-extension://${extensionId}/index.html`,
  })
  const loginUrl: string = `${GITHUB_ENDPOINT.AUTH}?${params}`

  useEffect(() => {
    if (accessToken) {
      const message: BgMessage = {
        type: BgActions.NOTIFICATIONS,
      }
      sendMessage(message)
        .then(data => {
          setStatus(Status.READY)
          setNotifications(data)
        })
        .catch((error: Error) => {
          setStatus(Status.ERROR)
          setError(error)
        })
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
        if (!accessToken) setStatus(Status.NEED_AUTH)
        else setAccessToken(accessToken)
      })
    }
  }, [])

  return { notifications, status, error, loginUrl }
}

export default useGithubAPI
