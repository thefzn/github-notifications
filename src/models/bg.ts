export enum BgActions {
  AUTH,
  NOTIFICATIONS,
  BADGE,
}

export type BgMessage = {
  type: BgActions
  message?: any
}

export type BgResponse<T = any> = {
  error?: string
  data?: T
}
