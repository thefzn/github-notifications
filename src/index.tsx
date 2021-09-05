import ReactDOM from 'react-dom'
import React from 'react'
import 'assets/css/general.css'
import { sendMessage, storageGet, storageSet } from 'services/chrome.service'
import { BgActions } from 'models/bg'
import { getQuery } from 'services/utils.service'

async function click(): Promise<void> {
  console.log('click')
  const { code }: Record<string, string> = getQuery()
  let { accessToken }: { accessToken: string | undefined } = await storageGet(
    'accessToken'
  )

  if (!accessToken) {
    if (!code) {
      globalThis.location.href =
        'https://github.com/login/oauth/authorize?client_id=5795cd5f7bb5bfe2b10b&scope=notifications&redirect_uri=chrome-extension%3A%2F%2Fhipobpdkogdphpnmfoenhbhgoldgngea%2Findex.html'
    } else {
      accessToken = await sendMessage({ type: BgActions.AUTH, message: code })
      console.log('accessToken collected: ' + accessToken)
      storageSet({ accessToken })
    }
  } else {
    console.log('accessToken stored: ' + accessToken)
  }
}

ReactDOM.render(
  <div>
    <button onClick={() => click()} type="button">
      Request
    </button>
  </div>,
  document.getElementById('app')
)
