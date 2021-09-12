import styled from 'styled-components'
import { NotificationClasses } from 'models/classes'

const NotificationElement = styled.div`
  padding: 7px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: border 0.5s, backgroundColor 0.5s;
  white-space: nowrap;

  &.${NotificationClasses.UNREAD} {
    border-left: 3px solid #1f6feb;
    background-color: rgba(56, 139, 253, 0.15);
  }
`

export default NotificationElement
