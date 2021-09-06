import Notification from 'models/github/Notification'

export enum GITHUB_ENDPOINT {
  AUTH = 'https://github.com/login/oauth/authorize',
  ACCESS_TOKEN = 'https://github.com/login/oauth/access_token',
  NOTIFICATIONS = 'https://api.github.com/notifications',
}

export enum Status {
  SUCCESS,
  WORKING,
  FAILURE,
  IDLE,
}

export enum ChromeStorageKeys {
  ACCESS_TOKEN = 'accessToken',
}

export interface ChromeStorage {
  [ChromeStorageKeys.ACCESS_TOKEN]?: string
}
