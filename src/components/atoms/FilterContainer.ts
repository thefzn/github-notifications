import styled from 'styled-components'
import Filter from 'components/atoms/Filter'

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0;
  width: 100%;

  ${Filter} {
    margin: 0 0 15px 5px;

    &:first-child {
      margin-left: 0;
    }
  }
`

export default FilterContainer
