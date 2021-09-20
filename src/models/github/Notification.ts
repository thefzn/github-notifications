import Reason, { ReasonMap } from 'models/github/Reason'
import NotificationEntity from 'models/response/Notification'
import PullRequest from 'models/response/PullRequest'
import { getItem } from 'services/api.service'

export interface Merge {
  base: string
  head: string
  repo: string
  merged: boolean
}
export interface PR {
  comments: number
  creation: string
  draft: boolean
  merge: Merge
  id: number
  number: number
  state: string
  lastUpdate: string
}

export enum UpdateReason {
  NO_UPDATE,
  READ,
  COMMENT,
  UNDRAFT,
  DRAFT,
  MERGE,
  BASE_CHANGE,
  STATE_CHANGE,
  OTHER,
}

export type NotificationStatus = Partial<Record<Reason, number>>

export default class Notification {
  public id: string
  public lastRead: string
  public title: string = ''
  public reason: Reason
  public link: string
  public unread: boolean
  public lastUpdate: string
  public prUrl: string = ''
  public pr?: PR
  public update: UpdateReason = UpdateReason.NO_UPDATE
  private loaded: boolean = false

  constructor(rawNotification: NotificationEntity | Notification) {
    this.id = rawNotification.id
    this.unread = rawNotification.unread
    if ('update' in rawNotification) {
      this.lastRead = rawNotification.lastRead
      this.lastUpdate = rawNotification.lastUpdate
      this.link = rawNotification.link
      this.prUrl = rawNotification.prUrl
      this.title = rawNotification.title
      this.reason = rawNotification.reason
      this.prUrl = rawNotification.prUrl

      if ('pr' in rawNotification) {
        this.pr = rawNotification.pr
        this.loaded = true
      }
    } else {
      this.lastRead = rawNotification.last_read_at
      this.lastUpdate = rawNotification.updated_at
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
    if (this.loaded || !this.unread) return this
    console.log('Loading PR data', this.id)

    const pullRequest: PullRequest = await getItem<PullRequest>(this.prUrl)

    this.pr = {
      comments: pullRequest.comments + pullRequest.review_comments,
      creation: pullRequest.created_at,
      draft: pullRequest.draft,
      merge: {
        base: pullRequest.base.ref,
        head: pullRequest.head.ref,
        repo: pullRequest.head.repo.full_name,
        merged: pullRequest.merged,
      },
      id: pullRequest.id,
      number: pullRequest.number,
      state: pullRequest.state,
      lastUpdate: pullRequest.updated_at,
    }

    this.link = pullRequest._links.html.href

    this.loaded = true
    return this
  }
}
