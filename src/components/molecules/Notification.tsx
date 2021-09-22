import NotificationElement from 'components/atoms/NotificationElement'
import NotificationInstance from 'models/github/Notification'
import { NotificationClasses } from 'models/classes'
import Label from 'components/atoms/Label'
import { formatTimeSince } from 'services/utils.service'

const Notification: React.FunctionComponent<{ data: NotificationInstance }> = ({
  data,
}) => {
  const classes: string[] = []
  const url: string = data.link
  const age: string = formatTimeSince(data.age)
  if (data.unread) classes.push(NotificationClasses.UNREAD)

  return (
    <NotificationElement className={classes.join(' ')}>
      <Label>{data.update}</Label>
      <Label>{age}</Label>
      {data.pr ? (
        <>
          <Label>C: {data.pr?.comments}</Label>
          <Label>{data.pr?.state}</Label>
          <Label>{data.pr?.merge.repo}</Label>
          <Label>
            {data.pr?.merge.base.toString()} -&gt;{' '}
            {data.pr?.merge.head.toString()}
          </Label>
        </>
      ) : (
        ''
      )}
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
