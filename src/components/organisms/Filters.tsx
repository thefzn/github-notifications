import { Filter as FilterType } from 'hooks/useFilters'
import Filter from 'components/molecules/Filter'
import FilterContainer from 'components/atoms/FilterContainer'

const Filters: React.FunctionComponent<{ filters: FilterType[] }> = ({
  filters,
  children,
}) => (
  <FilterContainer>
    {filters.map(filterData => (
      <Filter key={filterData.id} filter={filterData} />
    ))}
    {children}
  </FilterContainer>
)

export default Filters
