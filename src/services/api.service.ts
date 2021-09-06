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
  rawData?: Object | string,
  skipAuth: boolean = false
): Promise<T> {
  const token: ChromeStorage[ChromeStorageKeys.ACCESS_TOKEN] = await storageGet(
    ChromeStorageKeys.ACCESS_TOKEN
  )
  const headers: Headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
  })

  if (!skipAuth && token) headers.set('Authorization', `token ${token}`)

  const init: RequestInit = {
    method,
    headers,
  }

  if (rawData) {
    init.body = typeof rawData === 'string' ? rawData : objectToForm(rawData)
  }

  console.log('Requesting:', url, headers.get('Authorization'))
  const fetchResult: Response = await fetch(url, init)

  if (!fetchResult.ok) {
    console.log('Request error')
    throw new Error(fetchResult.status.toString())
  }

  const successData: T = await fetchResult.json()
  console.log('Request success', successData)
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
  const response: Notification[] | Error = await requestToGithub<
    Notification[]
  >('GET', GITHUB_ENDPOINT.NOTIFICATIONS)

  console.log('Notifications result', response)
  return response
}
