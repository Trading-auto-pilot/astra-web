import { Button, Chip, Paper, Stack } from '@mui/material';
import { kebabToSentenceCase } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import { useProducts } from 'components/sections/ecommerce/customer/products/providers/ProductsProvider';

const ActiveFilters = () => {
  const { filterItems, handleDeleteFilterItem, handleResetFilters } = useProducts();

  return (
    <Paper background={1} sx={{ py: 2, px: { xs: 3, md: 5 } }}>
      <Stack
        spacing={1}
        sx={{
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {filterItems.map((item) => (
          <Chip
            key={item.value}
            label={kebabToSentenceCase(item.value)}
            variant="soft"
            onDelete={() => handleDeleteFilterItem(item)}
          />
        ))}
        <Button
          variant="text"
          color="error"
          endIcon={
            <IconifyIcon
              icon="material-symbols:restart-alt-rounded"
              sx={{ fontSize: '20px !important' }}
            />
          }
          onClick={handleResetFilters}
        >
          Reset
        </Button>
      </Stack>
    </Paper>
  );
};

export default ActiveFilters;
