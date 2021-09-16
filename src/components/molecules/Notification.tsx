import NotificationElement from 'components/atoms/NotificationElement'
import NotificationInstance from 'models/github/Notification'
import { NotificationClasses } from 'models/classes'

const Notification: React.FunctionComponent<{ data: NotificationInstance }> = ({
  data,
}) => {
  const classes: string[] = []
  const url: string | undefined = data.url
  if (data.unread) classes.push(NotificationClasses.UNREAD)

  return (
    <NotificationElement className={classes.join(' ')}>
      {url ? (
        <a href={url} target="_blank">
          {data.subject.title}
        </a>
      ) : (
        data.subject.title
      )}
    </NotificationElement>
  )
}

export default Notification
