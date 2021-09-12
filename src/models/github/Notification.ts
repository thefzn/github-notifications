import Repository from 'models/github/Repository'
import Subject from 'models/github/Subject'
import Reason from './Reason'

export default interface Notification {
  id: string
  repository: Repository
  subject: Subject
  reason: Reason
  unread: boolean
  updated_at: string
  last_read_at: string
  url: string
  subscription_url: string
}

export type NotificationCollection = Record<Reason, Notification[]>
