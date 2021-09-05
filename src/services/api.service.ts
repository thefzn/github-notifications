import { AccessTokenResponse } from '../models/github'

export async function getAccessToken(code: string): Promise<string> {
  const init: RequestInit = {
    method: 'POST',
    body: `client_id=5795cd5f7bb5bfe2b10b&client_secret=cf3168ac3e7f459c535a1adea82c27673567be56&code=${code}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
  }
  const fetchResult: Response = await fetch(
    'https://github.com/login/oauth/access_token',
    init
  )
  console.log('fetchResult', fetchResult)
  const data: AccessTokenResponse = await fetchResult.json()
  return data.access_token
}
