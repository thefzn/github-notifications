import NotificationElement from 'components/atoms/NotificationElement'

const Message: React.FunctionComponent<{ url?: string }> = ({
  url,
  children,
}) => (
  <NotificationElement>
    {url ? (
      <a href={url} target="_blank">
        {children}
      </a>
    ) : (
      children
    )}
  </NotificationElement>
)

export default Message
