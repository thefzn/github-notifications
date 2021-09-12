import {
  ChromeStorage,
  ChromeStorageKeys,
  GITHUB_ENDPOINT,
} from 'models/github'
import AccessTokenRequest from 'models/request/AccessToken'
import AccessTokenResponse from 'models/response/AccessToken'
import Notification from 'models/github/Notification'
import { storageGet } from 'services/chrome.service'
import { objectToForm } from './utils.service'

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
  const response: Notification[] = await requestToGithub<Notification[]>(
    'GET',
    GITHUB_ENDPOINT.NOTIFICATIONS,
    { all: 'true', participating: 'true' }
  )

  if (response.length) {
    console.log(response[0].subject.url)
    getItem(response[0].subject.url)
  }
  return response
}

export async function getItem(url: string): Promise<any> {
  const response: any = await requestToGithub('GET', GITHUB_ENDPOINT.URL, {
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
