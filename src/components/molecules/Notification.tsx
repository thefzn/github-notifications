import NotificationElement from 'components/atoms/NotificationElement'
import NotificationInstance from 'models/github/Notification'
import { NotificationClasses } from 'models/classes'

const Notification: React.FunctionComponent<{ data: NotificationInstance }> = ({
  data,
}) => {
  const classes: string[] = []
  const url: string = data.link
  if (data.unread) classes.push(NotificationClasses.UNREAD)

  return (
    <NotificationElement className={classes.join(' ')}>
      {url ? (
        <a href={url} target="_blank">
          {data.title}
        </a>
      ) : (
        data.title
      )}
    </NotificationElement>
  )
}

export default Notification
