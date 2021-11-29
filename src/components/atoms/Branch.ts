import styled from 'styled-components'

const Info = styled.span`
  font-size: 0.9em;
  padding-top: 5px;
  text-align: right;

  strong {
    background: black;
    border-radius: 10px;
    color: white;
    display: inline-block;
    padding: 0.1em 0.5em;
    margin-right: 5px;
  }
  a,
  span {
    display: inline-inline-block;
    padding: 0 5px 0 0;
    text-decoration: none !important;
  }
  a {
    color: #006eed;
  }
`

export default Info
