import NotificationElement from 'components/atoms/NotificationElement'
import Notification from 'models/github/Notification'
import { NotificationClasses } from 'models/classes'

const Notification: React.FunctionComponent<{ data: Notification }> = ({
  data,
}) => {
  const classes: string[] = []
  if (data.unread) classes.push(NotificationClasses.UNREAD)

  return (
    <NotificationElement className={classes.join(' ')}>
      <a href={data.subject.latest_comment_url}>{data.subject.title}</a>
    </NotificationElement>
  )
}

export default Notification
