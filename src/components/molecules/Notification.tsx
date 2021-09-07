import NotificationElement from 'components/atoms/NotificationElement'
import Notification from 'models/github/Notification'
import { NotificationClasses } from 'models/classes'

const Notification: React.FunctionComponent<{ data: Notification }> = ({
  data,
}) => {
  const classes: string[] = []
  if (data.unread) classes.push(NotificationClasses.UNREAD)

  return (
    <NotificationElement>
      <a href={data.url}>{data.subject.title}</a>
    </NotificationElement>
  )
}

export default Notification
