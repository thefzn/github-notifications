import { Status, ChromeStorageKeys } from 'models/github'
import { BgMessage, BgResponse } from 'models/bg'

const msgListeners: Function[] = []
const unloadListeners: Function[] = []

export const { id }: ChromeExtensionDetails = chrome.app.getDetails()

const msgListener: any = chrome.runtime.onMessage.addListener(
  (request, sender, respond) => {
    if (sender.id === id) {
      msgListeners.forEach(fn => fn(request, respond))
    }
    return true
  }
)
const unloadListener: any = chrome.runtime.onSuspend.addListener(() => {
  unloadListeners.forEach(listener => listener())
})

export function stopListening(): void {
  chrome.runtime.onMessage.removeListener(msgListener)
  chrome.runtime.onMessage.removeListener(unloadListener)
}

export function onMessage(fn: Function): void {
  if (typeof fn === 'function') {
    msgListeners.push(fn)
  }
}

export function onUnload(fn: Function): void {
  if (typeof fn === 'function') {
    unloadListeners.push(fn)
  }
  chrome.browserAction.setBadgeText({ text: '' })
}

export async function sendMessage<T = any>(message: BgMessage): Promise<T> {
  console.log('Sending Message to BG', message)
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response: BgResponse<T>): void => {
      if (response.error || !response.data) {
        const error = response.error || 'Empty response'
        console.log('Request failed', error)
        reject(new Error(error))
      } else {
        console.log('Request success', response.data)
        resolve(response.data)
      }
    })
  })
}

export async function storageGet(
  key: ChromeStorageKeys
): Promise<string | undefined> {
  return localStorage.getItem(key) || undefined
}

export async function storageSet(
  key: ChromeStorageKeys,
  value: string
): Promise<void> {
  await localStorage.setItem(key, value)
}

export function setBadge(status: Status): void {
  let text: string
  switch (status) {
    case Status.LOADING:
      text = '✓'
      break
    case Status.ERROR:
      text = '✕'
      break
    case Status.READY:
    default:
      text = ''
  }
  chrome.browserAction.setBadgeText({ text })
}
