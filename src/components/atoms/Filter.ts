import styled from 'styled-components'

export const FilterBadge = styled.span`
  background-color: #ffffff;
  background-image: linear-gradient(#54a3ff, #006eed);
  border-radius: 20px;
  color: #ffffff;
  display: inline-block;
  font-size: 0.6rem;
  margin-left: 5px;
  padding: 2px 5px;
  transform: translateY(-1px);
  transition: 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  transition-property: color, background-image;
`

const Filter = styled.button`
  background-color: #21262d;
  border: 1px solid rgba(240, 246, 252, 0.1);
  border-radius: 5px;
  box-sizing: border-box;
  color: #c9d1d9;
  cursor: pointer;
  font-size: 0.8rem;
  line-height: 1.2;
  overflow: visible;
  padding: 5px 10px;
  position: relative;
  text-transform: capitalize;
  transition: 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  transition-property: color, background-color, border-color;
  vertical-align: middle;

  &:hover {
    background-color: #30363d;
    border-color: #8b949e;
  }

  &.selected {
    background-color: #238636;
    border-color: #238636;
    color: #ffffff;

    ${FilterBadge} {
      background-image: none;
      color: #238636;
    }
  }
`

export default Filter
