import styled from 'styled-components'
import NotificationElement from 'components/atoms/NotificationElement'

const Container = styled.section`
  border: 1px solid #c9d1d9;
  border-radius: 5px;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 500px;

  ${NotificationElement} + ${NotificationElement} {
    border-top: 1px solid #c9d1d9;
  }
`

export default Container
