import { useCallback } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { productListAdmin } from 'data/e-commerce/products';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import FilterMenu from './FilterMenu';

const vendors = Array.from(new Set(productListAdmin.map((item) => item.vendor)));
const categories = Array.from(new Set(productListAdmin.map((item) => item.category)));
const statuses = ['active', 'inactive', 'draft', 'archive'];

const FilterSection = ({ apiRef, handleToggleFilterPanel }) => {
  const { up } = useBreakpoints();
  const upSm = up('sm');

  const handleFilter = useCallback(
    (field, value, defaultOperator = 'contains') => {
      if (!field) {
        apiRef.current?.setFilterModel({ items: [] });
      } else {
        const operator = field === 'status' ? 'equals' : defaultOperator;
        apiRef.current?.setFilterModel({
          items: [{ field, operator, value: value?.toString() }],
        });
      }
    },
    [apiRef],
  );

  return (
    <Stack
      justifyContent="space-between"
      sx={{
        gap: 1,
      }}
    >
      <Stack spacing={1} sx={{ overflowX: { xs: 'auto', md: 'initial' }, scrollbarWidth: 'thin' }}>
        <FilterMenu label="Vendor" field="vendor" handleFilter={handleFilter} menuItems={vendors} />
        <FilterMenu
          label="Tagged With"
          field="category"
          handleFilter={handleFilter}
          menuItems={categories}
        />
        <FilterMenu
          label="Status"
          field="status"
          handleFilter={handleFilter}
          menuItems={statuses}
        />
      </Stack>

      <Stack spacing={{ xs: 1, sm: 2, md: 3 }}>
        <Button
          variant="text"
          color="neutral"
          shape={upSm ? undefined : 'square'}
          disabled
          sx={{ ml: { md: 'auto' }, flexShrink: 0, minWidth: 0 }}
        >
          <IconifyIcon icon="material-symbols:star-rounded" fontSize={20} />
          {upSm && <Box component="span">Saved</Box>}
        </Button>

        <Button
          variant="text"
          sx={{ flexShrink: 0 }}
          color="neutral"
          shape={upSm ? undefined : 'square'}
          onClick={handleToggleFilterPanel}
        >
          {upSm && (
            <IconifyIcon icon="material-symbols:swap-vert-rounded" fontSize={'20px !important'} />
          )}
          {!upSm && (
            <IconifyIcon icon="material-symbols:filter-alt-outline" fontSize={'20px !important'} />
          )}
          {upSm && <Box component="span">More filters</Box>}
        </Button>
      </Stack>
    </Stack>
  );
};

export default FilterSection;
