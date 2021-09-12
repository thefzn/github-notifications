import { Filter as FilterType } from 'hooks/useFilters'
import Filter, { FilterBadge } from 'components/atoms/Filter'

const FilterEl: React.FunctionComponent<{
  filter: FilterType
}> = ({ filter }) => (
  <Filter
    onClick={() => filter.select()}
    className={filter.selected ? 'selected' : undefined}
    type="button"
  >
    {filter.label}
    <FilterBadge>{filter.count}</FilterBadge>
  </Filter>
)

export default FilterEl
