import { SubjectEntity, RepositoryEntity } from 'models/response/GithubCommons'

export enum ReasonEntity {
  ASSIGN = 'assign',
  AUTHOR = 'author',
  COMMENT = 'comment',
  INVITATION = 'invitation',
  MANUAL = 'manual',
  MENTION = 'mention',
  REVIEW_REQUESTED = 'review_requested',
  SECURITY_ALERT = 'security_alert',
  STATE_CHANGE = 'state_change',
  SUBSCRIBED = 'subscribed',
  TEAM_MENTION = 'team_mention',
}

export default interface Notification {
  id: string
  last_read_at: string
  reason: ReasonEntity
  repository: RepositoryEntity
  subject: SubjectEntity
  subscription_url: string
  unread: boolean
  updated_at: string
  url: string
}
