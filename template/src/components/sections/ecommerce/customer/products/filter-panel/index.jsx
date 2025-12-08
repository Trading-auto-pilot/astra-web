import { Divider, Stack } from '@mui/material';
import FilterSection from './FilterSection';
import PriceFilterSection from './PriceFilterSection';

const FilterPanel = ({ filterOptions }) => {
  return (
    <Stack direction="column" divider={<Divider sx={{ my: 2 }} />} sx={{ mb: 3 }}>
      {filterOptions.availability && (
        <FilterSection
          defaultOpen
          title="Availability"
          options={filterOptions.availability}
          name="availability"
        />
      )}
      {filterOptions.sale && (
        <FilterSection defaultOpen title="Sale" options={filterOptions.sale} name="sale" />
      )}
      {filterOptions.material && (
        <FilterSection
          defaultOpen
          options={filterOptions.material}
          name="material"
          title="Material"
        />
      )}
      {filterOptions.category && (
        <FilterSection
          defaultOpen
          title="Category"
          options={filterOptions.category}
          name="category"
        />
      )}
      {filterOptions.price && (
        <PriceFilterSection defaultOpen defaultValue={filterOptions.price || [0, 5000]} />
      )}
      {filterOptions.features && (
        <FilterSection
          defaultOpen
          title="Features"
          options={filterOptions.features}
          name="features"
        />
      )}
    </Stack>
  );
};

export default FilterPanel;
