import Reason, { ReasonMap } from 'models/github/Reason'
import { SubjectEntity } from 'models/response/GithubCommons'
import RequestNotification from 'models/response/Notification'
import PullRequest from 'models/response/PullRequest'
import { getItem } from 'services/api.service'

export interface Merge {
  base: string
  head: string
  repo: string
}
export interface PR {
  body: string
  comments: number
  created_at: string
  draft: boolean
  merge: Merge
  id: number
  merged: boolean
  number: number
  state: string
  title: string
  updated_at: string
}

export default class Notification {
  public id: string
  public last_read_at: string
  public reason: Reason
  public subject: SubjectEntity
  public subscription_url: string
  public unread: boolean
  public updated_at: string
  public url?: string
  public pr?: PR
  private loaded: boolean = false

  constructor(rawNotification: RequestNotification | Notification) {
    this.id = rawNotification.id
    this.last_read_at = rawNotification.last_read_at
    this.subject = rawNotification.subject
    this.subscription_url = rawNotification.subscription_url
    this.unread = rawNotification.unread
    this.updated_at = rawNotification.updated_at

    if ('pr' in rawNotification) {
      this.reason = rawNotification.reason
      this.pr = rawNotification.pr
      this.url = rawNotification.url
      this.loaded = true
    } else {
      this.reason = ReasonMap[(rawNotification as RequestNotification).reason]
    }
  }

  async load(): Promise<void> {
    if (this.loaded || !this.unread) return

    const pullRequest: PullRequest = await getItem<PullRequest>(
      this.subject.url
    )

    this.pr = {
      body: pullRequest.body,
      comments: pullRequest.comments + pullRequest.review_comments,
      created_at: pullRequest.created_at,
      draft: pullRequest.draft,
      merge: {
        base: pullRequest.base.ref,
        head: pullRequest.head.ref,
        repo: pullRequest.head.repo.full_name,
      },
      id: pullRequest.id,
      merged: pullRequest.merged,
      number: pullRequest.number,
      state: pullRequest.state,
      title: pullRequest.title,
      updated_at: pullRequest.updated_at,
    }

    this.url = pullRequest._links.html.href

    this.loaded = true
  }
}
