import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import paths from 'routes/paths';
import PageHeader from 'components/sections/ecommerce/admin/common/PageHeader';
import ProductListingStepper from 'components/sections/ecommerce/admin/product-listing/ProductListingStepper';

const ProductListing = () => {
  return (
    <Grid container>
      <Grid size={12}>
        <PageHeader
          title="Product listing"
          breadcrumb={[
            { label: 'Home', url: paths.ecommerceHomepage },
            { label: 'Product listing', active: true },
          ]}
        />
      </Grid>
      <Grid size={12}>
        <Paper sx={{ height: 1 }}>
          <ProductListingStepper />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ProductListing;
