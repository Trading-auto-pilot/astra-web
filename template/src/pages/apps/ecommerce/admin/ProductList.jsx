import { Button, Paper, Stack } from '@mui/material';
import paths from 'routes/paths';
import PageHeader from 'components/sections/ecommerce/admin/common/PageHeader';
import ProductListContainer from 'components/sections/ecommerce/admin/product-list';

const ProductList = () => {
  return (
    <Stack direction="column" height={1}>
      <PageHeader
        title="Product list"
        breadcrumb={[
          { label: 'Home', url: paths.ecommerceHomepage },
          { label: 'Products', active: true },
        ]}
        actionComponent={
          <Stack
            sx={{
              gap: 1,
            }}
          >
            <Button variant="soft" color="neutral">
              Export
            </Button>
            <Button variant="soft" color="neutral">
              Import
            </Button>
          </Stack>
        }
      />
      <Paper sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
        <ProductListContainer />
      </Paper>
    </Stack>
  );
};

export default ProductList;
