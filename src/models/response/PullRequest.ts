import {
  UserEntity,
  LabelEntity,
  MilestoneEntity,
  TeamEntity,
  CommitEntity,
  LinksEntity,
} from 'models/response/GithubCommons'

export default interface PullRequest {
  active_lock_reason: string | null
  additions: number
  assignee: UserEntity | null
  assignees: UserEntity[]
  author_association: string
  auto_merge: string | null
  base: CommitEntity
  body: string
  changed_files: number
  closed_at: string
  comments: number
  comments_url: string
  commits: number
  commits_url: string
  created_at: string
  deletions: number
  diff_url: string
  draft: boolean
  head: CommitEntity
  html_url: string
  id: number
  issue_url: string
  labels: LabelEntity[]
  locked: boolean
  maintainer_can_modify: boolean
  merge_commit_sha: string
  mergeable: boolean | null
  mergeable_state: string
  merged: boolean
  merged_at: string
  merged_by: UserEntity | null
  milestone: MilestoneEntity | null
  node_id: string
  number: number
  patch_url: string
  rebaseable: boolean | null
  requested_reviewers: UserEntity[]
  requested_teams: TeamEntity[]
  review_comment_url: string
  review_comments: number
  review_comments_url: string
  state: 'open' | 'closed'
  statuses_url: string
  title: string
  updated_at: string
  url: string
  user: UserEntity | null
  _links: LinksEntity
}
