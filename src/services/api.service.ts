import { ChromeStorageKeys, GITHUB_ENDPOINT } from 'models/github'
import AccessTokenRequest from 'models/request/AccessToken'
import AccessTokenResponse from 'models/response/AccessToken'
import Notification, { NotificationStatus } from 'models/github/Notification'
import NotificationEntity from 'models/response/Notification'
import { setBadge, storageGet, storageSet } from 'services/chrome.service'
import { objectToForm } from './utils.service'
import NotificationService from 'services/notification.service'

async function requestToGithub<T = any>(
  method: 'GET' | 'POST' | 'PUT',
  url: GITHUB_ENDPOINT,
  rawData?: Record<string, string> | string,
  skipAuth: boolean = false
): Promise<T> {
  const token: string | undefined = await storageGet(
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
    if ([401, 403].includes(fetchResult.status)) {
      setBadge('')
      storageSet(ChromeStorageKeys.ACCESS_TOKEN, '')
    }
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
  let responseRaw: NotificationEntity[] = []
  try {
    responseRaw = await requestToGithub<NotificationEntity[]>(
      'GET',
      GITHUB_ENDPOINT.NOTIFICATIONS,
      {
        all: 'true',
        participating: 'true',
        per_page: '50',
      }
    )
  } catch (err) {
    console.error(err)
  }

  if (responseRaw.length) {
    const updates: NotificationEntity[] = responseRaw.filter(
      (rawItem: NotificationEntity): boolean =>
        rawItem.subject.type === 'PullRequest'
    )

    return NotificationService.unpackAndUpdate(updates)
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
