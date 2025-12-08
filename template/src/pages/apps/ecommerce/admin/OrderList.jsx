import { Button, Paper, Stack } from '@mui/material';
import paths from 'routes/paths';
import PageHeader from 'components/sections/ecommerce/admin/common/PageHeader';
import OrderListContainer from 'components/sections/ecommerce/admin/order-list';

const OrderList = () => {
  return (
    <Stack direction="column" height={1}>
      <PageHeader
        title="Order list"
        breadcrumb={[
          { label: 'Home', url: paths.ecommerceHomepage },
          { label: 'Order list', active: true },
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
        <OrderListContainer />
      </Paper>
    </Stack>
  );
};

export default OrderList;
