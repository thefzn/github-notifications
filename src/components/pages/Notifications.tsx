import useGithubAPI from 'hooks/useGithubAPI'
import { id } from 'services/chrome.service'
import Title from 'components/atoms/Title'
import Notification from 'components/molecules/Notification'
import Container from 'components/atoms/Container'

const NotificationsComponent: React.FunctionComponent = () => {
  const githubClient: string = process.env.GITHUB_CLIENT || ''
  const { notifications, ready, error } = useGithubAPI(githubClient, id)

  return (
    <main>
      <Title>Notifications</Title>
      <Container>
        {error
          ? error.message
          : !ready
          ? 'Loading...'
          : notifications.map(data => (
              <Notification key={data.id} data={data} />
            ))}
      </Container>
    </main>
  )
}

export default NotificationsComponent
