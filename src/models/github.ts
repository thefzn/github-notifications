export interface AccessTokenResponse {
  access_token: string
  scope: string
  token_type: string
}

export enum Status {
  SUCCESS,
  WORKING,
  FAILURE,
  IDLE,
}
