import { Container, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { orderDetailsList } from 'data/e-commerce/orders';
import paths from 'routes/paths';
import PageHeader from 'components/sections/ecommerce/customer/common/PageHeader';
import OrderListContainer from 'components/sections/ecommerce/customer/order-list';

const OrderList = () => {
  return (
    <Grid container>
      <Grid size={12}>
        <PageHeader
          title="Order list"
          userLoggedIn
          breadcrumb={[
            { label: 'Home', url: paths.ecommerceHomepage },
            { label: 'Order list', active: true },
          ]}
        />
      </Grid>
      <Grid size={12}>
        <Paper sx={{ height: 1, px: { xs: 3, md: 5 }, py: { xs: 5, md: 8 } }}>
          <Container maxWidth="lg" sx={{ px: { xs: 0 } }}>
            <OrderListContainer orders={orderDetailsList} />
          </Container>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OrderList;
