import { Status } from 'models/github'

import { id } from 'services/chrome.service'

import Message from 'components/molecules/Message'
import Notifications from 'components/pages/Notifications'
import Container from 'components/atoms/Container'
import Filters from 'components/organisms/Filters'

import useGithubAPI from 'hooks/useGithubAPI'
import useFilters from 'hooks/useFilters'
import Title from 'components/atoms/Title'

const NotificationsComponent: React.FunctionComponent = () => {
  const githubClient: string = process.env.GITHUB_CLIENT || ''
  const { notifications, status, error, loginUrl } = useGithubAPI(
    githubClient,
    id
  )
  const [filters, results] = useFilters(notifications, 'reason', 'unread', true)
  let title: string = 'Github Notifications'
  let message: string | undefined

  switch (status) {
    case Status.ERROR:
      title = 'Error!'
      message = error?.message
      break
    case Status.LOADING:
      title = 'Loading'
      message = 'Loading...'
      break
    case Status.READY:
      title = 'Github Notifications'
      message = !results.length ? 'You are all set!' : ''
      break
    case Status.NEED_AUTH:
      message = 'Please signin to enable Notifications.'
  }

  return (
    <main>
      {!!title ? <Title>{title}</Title> : ''}
      {!!filters?.length ? <Filters filters={filters} /> : ''}
      <Container>
        {message ? <Message>{message}</Message> : ''}
        {!!results?.length ? <Notifications items={results} /> : ''}
      </Container>
    </main>
  )
}

export default NotificationsComponent
