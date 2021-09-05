import { Status } from 'models/github'
import { BgMessage } from 'models/bg'

const msgListeners: Function[] = []
const unloadListeners: Function[] = []

export const { id }: { id: chrome.runtime.MessageSender } =
  chrome.app.getDetails()

const msgListener: any = chrome.runtime.onMessage.addListener(
  (request, sender, respond) => {
    console.log(request, sender)
    if (sender.id === id) {
      msgListeners.forEach(fn => fn(request, respond))
    }
    return true
  }
)
const unloadListener: any = chrome.runtime.onSuspend.addListener(() => {
  // eslint-disable-next-line no-console
  console.log('Unloading.')
  unloadListeners.forEach(listener => listener())
})

export function stopListening() {
  const test: chrome.runtime.ExtensionMessageEvent = chrome.runtime.onMessage
  chrome.runtime.onMessage.removeListener(msgListener)
  chrome.runtime.onMessage.removeListener(unloadListener)
}

export function onMessage(fn: Function) {
  if (typeof fn === 'function') {
    msgListeners.push(fn)
  }
}

export function onUnload(fn: Function) {
  if (typeof fn === 'function') {
    unloadListeners.push(fn)
  }
  chrome.browserAction.setBadgeText({ text: '' })
}

export async function sendMessage(data: BgMessage): Promise<any> {
  console.log('sending')
  return new Promise(resolve => {
    console.log('creating promise')
    chrome.runtime.sendMessage(data, (response: any): void => {
      console.log('creating callback', response)
      resolve(response)
    })
  })
}

export async function storageGet(key: string): Promise<any> {
  return new Promise(resolve => {
    console.log('storage.get')
    chrome.storage.sync.get(key, response => {
      console.log('storage.get result:', response)
      resolve(response)
    })
  })
}

export async function storageSet(items: any): Promise<any> {
  console.log('storage.set')
  await chrome.storage.sync.set(items)
}

export function setBadge(status: Status) {
  let text: string
  switch (status) {
    case Status.SUCCESS:
      text = '✓'
      break
    case Status.WORKING:
      text = '⏳'
      break
    case Status.FAILURE:
      text = '✕'
      break
    case Status.IDLE:
    default:
      text = ''
  }
  chrome.browserAction.setBadgeText({ text })
}
