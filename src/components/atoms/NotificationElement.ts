import styled from 'styled-components'
import { NotificationClasses } from 'models/classes'
import Info from './Info'
import Comments from './Comments'
import Branch from './Branch'
import Repo from './Repo'
import UpdateIcon from './UpdateIcon'

const NotificationElement = styled.div`
  display: grid;
  grid-template-areas:
    'img repo bnch'
    'img link link'
    'img info info ';
  grid-template-columns: 50px auto 1fr;
  height: 60px;
  overflow: hidden;
  transition: border 0.5s, backgroundColor 0.5s;

  &.${NotificationClasses.UNREAD} {
    background-color: rgba(56, 139, 253, 0.15);
    border-left: 3px solid #1f6feb;
  }

  ${Info} {
    grid-area: info;
  }
  ${UpdateIcon} {
    grid-area: img;
  }
  ${Branch} {
    grid-area: bnch;
  }
  ${Repo} {
    grid-area: repo;
  }
  ${Comments} {
    grid-area: comm;
  }
  > a {
    display: block;
    font-size: 1.2em;
    grid-area: link;
    overflow: hidden;
    padding: 4px 0 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
`

export default NotificationElement
