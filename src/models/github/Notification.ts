import Reason, { ReasonMap } from 'models/github/Reason'
import NotificationEntity from 'models/response/Notification'
import PullRequest from 'models/response/PullRequest'
import { getItem } from 'services/api.service'

export interface Merge {
  base: string
  head: string
  repo: string
}
export interface PR {
  comments: number
  commits: number
  creation: string
  draft: boolean
  merge: Merge
  id: number
  number: number
  state: 'open' | 'closed'
}

export enum UpdateReason {
  NO_UPDATE = 'NO_UPDATE',
  READ = 'READ',
  COMMENT = 'COMMENT',
  UNDRAFT = 'UNDRAFT',
  DRAFT = 'DRAFT',
  MERGE = 'MERGE',
  BASE_CHANGE = 'BASE_CHANGE',
  STATE_CHANGE = 'STATE_CHANGE',
  OTHER = 'OTHER',
}

export type NotificationStatus = Partial<Record<Reason, number>>

export default class Notification {
  public id: string
  public lastRead: string
  public title: string = ''
  public reason: Reason
  public link: string
  public unread: boolean
  public age: number
  public prUrl: string = ''
  public pr?: PR
  public update: UpdateReason = UpdateReason.NO_UPDATE

  constructor(rawNotification: NotificationEntity | Notification) {
    this.id = rawNotification.id
    this.unread = rawNotification.unread
    if ('update' in rawNotification) {
      this.lastRead = rawNotification.lastRead
      this.age = rawNotification.age
      this.link = rawNotification.link
      this.prUrl = rawNotification.prUrl
      this.title = rawNotification.title
      this.reason = rawNotification.reason
      this.prUrl = rawNotification.prUrl

      if ('pr' in rawNotification) {
        this.pr = rawNotification.pr
      }
    } else {
      this.lastRead = rawNotification.last_read_at
      this.age = new Date(rawNotification.updated_at).getTime()
      this.link = rawNotification.subject.url.replace('api.github', 'github')
      this.prUrl = rawNotification.subject.url
      this.title = rawNotification.subject.title
      this.reason = ReasonMap[(rawNotification as NotificationEntity).reason]
    }
  }

  /**
   * Loads PR info for the Notification
   *
   * @returns Empty promise
   */
  async loadPRData(): Promise<Notification> {
    if (this.pr || !this.unread) return this

    const pullRequest: PullRequest = await getItem<PullRequest>(this.prUrl)

    this.pr = {
      comments: pullRequest.comments + pullRequest.review_comments,
      creation: pullRequest.created_at,
      draft: pullRequest.draft,
      merge: {
        base: pullRequest.base.ref,
        head: pullRequest.head.ref,
        repo: pullRequest.head.repo.full_name,
      },
      id: pullRequest.id,
      number: pullRequest.number,
      state: pullRequest.state,
      commits: pullRequest.commits,
    }

    this.link = pullRequest._links.html.href

    return this
  }
}
