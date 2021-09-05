export enum BgActions {
  AUTH,
}

export type BgMessage = {
  type: BgActions
  message: any
}
