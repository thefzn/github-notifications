import { ReasonEntity } from 'models/response/Notification'

export enum Reason {
  MINE = 'My PRs',
  REVIEWING = 'To Review',
  OTHERS = 'Others',
}

export const ReasonMap: Record<ReasonEntity, Reason> = {
  [ReasonEntity.ASSIGN]: Reason.MINE,
  [ReasonEntity.AUTHOR]: Reason.MINE,
  [ReasonEntity.COMMENT]: Reason.REVIEWING,
  [ReasonEntity.INVITATION]: Reason.OTHERS,
  [ReasonEntity.MANUAL]: Reason.OTHERS,
  [ReasonEntity.MENTION]: Reason.REVIEWING,
  [ReasonEntity.REVIEW_REQUESTED]: Reason.REVIEWING,
  [ReasonEntity.SECURITY_ALERT]: Reason.OTHERS,
  [ReasonEntity.STATE_CHANGE]: Reason.OTHERS,
  [ReasonEntity.SUBSCRIBED]: Reason.OTHERS,
  [ReasonEntity.TEAM_MENTION]: Reason.OTHERS,
}

export default Reason
