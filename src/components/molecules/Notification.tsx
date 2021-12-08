import NotificationElement from 'components/atoms/NotificationElement'
import NotificationInstance from 'models/github/Notification'
import { NotificationClasses } from 'models/classes'
import { formatTimeSince } from 'services/utils.service'
import Info from 'components/atoms/Info'
import Branch from 'components/atoms/Branch'
import Repo from 'components/atoms/Repo'
import Label from 'components/atoms/Label'
import ReasonIcon from 'components/molecules/ReasonIcon'

const Notification: React.FunctionComponent<{ data: NotificationInstance }> = ({
  data,
}) => {
  const classes: string[] = []
  const url: string = data.link
  const age: string = formatTimeSince(data.age)
  let comments: string = '0 comments'

  if (data.unread) classes.push(NotificationClasses.UNREAD)
  if (data.pr?.comments)
    comments =
      data.pr?.comments === 1 ? '1 comment' : `${data.pr?.comments} comments`

  return (
    <NotificationElement className={classes.join(' ')}>
      <ReasonIcon icon={data.update} />
      <Info>
        🕒 {age} 💬 {comments}
      </Info>
      {data.pr ? (
        <>
          <Repo>
            <Label>{data.pr?.merge.repo}</Label>
          </Repo>
          <Branch>
            <a
              href={`https://github.com/${data.pr?.merge.repo}/tree/${data.pr?.merge.base}`}
            >
              {data.pr?.merge.base.toString()}
            </a>
            <span>to</span>
            <a
              href={`https://github.com/${data.pr?.merge.repo}/tree/${data.pr?.merge.head}`}
            >
              {data.pr?.merge.head.toString()}
            </a>
          </Branch>
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
