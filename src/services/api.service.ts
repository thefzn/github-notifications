import {
  ChromeStorage,
  ChromeStorageKeys,
  GITHUB_ENDPOINT,
} from 'models/github'
import AccessTokenRequest from 'models/request/AccessToken'
import AccessTokenResponse from 'models/response/AccessToken'
import Notification from 'models/github/Notification'
import NotificationResponse from 'models/response/Notification'
import { storageGet } from 'services/chrome.service'
import { objectToForm } from './utils.service'
import { ReasonMap } from 'models/github/Reason'

async function requestToGithub<T = any>(
  method: 'GET' | 'POST' | 'PUT',
  url: GITHUB_ENDPOINT,
  rawData?: Record<string, string> | string,
  skipAuth: boolean = false
): Promise<T> {
  const token: ChromeStorage[ChromeStorageKeys.ACCESS_TOKEN] = await storageGet(
    ChromeStorageKeys.ACCESS_TOKEN
  )
  const headers: Headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache',
  })
  let queryParams = ''
  let replacedURL = ''

  if (!skipAuth && token) headers.set('Authorization', `token ${token}`)

  const init: RequestInit = {
    method,
    headers,
  }

  if (rawData) {
    if (method === 'GET') {
      if (typeof rawData === 'object') {
        Object.keys(rawData).forEach((key: string) => {
          if (url.includes(`{${key}}`)) {
            replacedURL = replacedURL || url
            replacedURL = replacedURL.replace(`{${key}}`, rawData[key])
            delete rawData[key]
            console.log(url, key, replacedURL)
          }
        })
      }
      const encodedParams =
        typeof rawData === 'string' ? rawData : objectToForm(rawData)
      queryParams = encodedParams ? `?${encodedParams}` : ''
    } else {
      init.body = typeof rawData === 'string' ? rawData : objectToForm(rawData)
    }
  }

  const fetchResult: Response = await fetch(
    `${replacedURL || url}${queryParams}`,
    init
  )

  if (!fetchResult.ok) {
    throw new Error(fetchResult.status.toString())
  }

  const successData: T = await fetchResult.json()
  return successData
}

export async function getAccessToken(code: string): Promise<string> {
  const data: AccessTokenRequest = {
    client_id: process.env.GITHUB_CLIENT || '',
    client_secret: process.env.GITHUB_SECRET || '',
    code: code,
  }
  const response: AccessTokenResponse =
    await requestToGithub<AccessTokenResponse>(
      'POST',
      GITHUB_ENDPOINT.ACCESS_TOKEN,
      data,
      true
    )

  return response.access_token
}

export async function getNotifications(): Promise<Notification[]> {
  const responseRaw: NotificationResponse[] = await requestToGithub<
    NotificationResponse[]
  >('GET', GITHUB_ENDPOINT.NOTIFICATIONS, {
    all: 'true',
    participating: 'true',
  })

  if (responseRaw.length) {
    const response: Notification[] = responseRaw.reduce(
      (res: Notification[], rawItem: NotificationResponse): Notification[] => {
        if (rawItem.subject.type === 'PullRequest') {
          res.push(new Notification(rawItem))
        }
        return res
      },
      []
    )
    await Promise.all(response.map(item => item.load()))
    getItem(response[0].subject.url)
    return response
  }
  return []
}

export async function getItem<T>(url: string): Promise<T> {
  const response: T = await requestToGithub('GET', GITHUB_ENDPOINT.URL, {
    url,
  })

  return response
}

export async function getThreadSubscription(thread_id: string): Promise<any> {
  const response: any = await requestToGithub(
    'GET',
    GITHUB_ENDPOINT.THREAD_SUBSCRIPTION,
    { thread_id }
  )

  return response
}
