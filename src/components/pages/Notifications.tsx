import Notification from 'components/molecules/Notification'
import NotificationInterface from 'models/github/Notification'

const Notifications: React.FunctionComponent<{
  items: NotificationInterface[]
}> = ({ items }) => (
  <>
    {items.map(data => (
      <Notification key={data.id} data={data} />
    ))}
  </>
)

export default Notifications
