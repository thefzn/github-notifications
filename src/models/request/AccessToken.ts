export default interface AccessTokenRequest extends Record<string, string> {
  client_id: string
  client_secret: string
  code: string
}
