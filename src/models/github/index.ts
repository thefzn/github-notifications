export enum GITHUB_ENDPOINT {
  AUTH = 'https://github.com/login/oauth/authorize',
  ACCESS_TOKEN = 'https://github.com/login/oauth/access_token',
  NOTIFICATIONS = 'https://api.github.com/notifications',
  THREAD = 'https://api.github.com/notifications/threads/{thread_id}',
  THREAD_SUBSCRIPTION = 'https://api.github.com/notifications/threads/{thread_id}/subscription',
  URL = '{url}',
}

export enum Status {
  LOADING,
  NEED_AUTH,
  AUTH_SUCCESS,
  ERROR,
  READY,
}

export enum ChromeStorageKeys {
  ACCESS_TOKEN = 'accessToken',
  NOTIFICATIONS = 'notifications',
}
