import useGithubAPI from 'hooks/useGithubAPI'
import { id } from 'services/chrome.service'

const NotificationsComponent: React.FunctionComponent = () => {
  const githubClient: string = process.env.GITHUB_CLIENT || ''
  const { notifications, ready } = useGithubAPI(githubClient, id)
  const text = ready ? notifications.length : 'Loading...'

  return <div>Items: {text}</div>
}

export default NotificationsComponent
