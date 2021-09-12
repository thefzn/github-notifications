import NotificationElement from 'components/atoms/NotificationElement'

const Message: React.FunctionComponent<{ url?: string }> = ({
  url,
  children,
}) => (
  <NotificationElement>
    <a href={url}>{children}</a>
  </NotificationElement>
)

export default Message
