import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { customerInfo } from 'data/e-commerce/customerAccount';
import AccountAside from 'components/sections/ecommerce/customer/customer-account/AccountAside';
import GeneralInfo from 'components/sections/ecommerce/customer/customer-account/main/GeneralInfo';
import OrderStatus from 'components/sections/ecommerce/customer/customer-account/main/OrderStatus';
import Summary from 'components/sections/ecommerce/customer/customer-account/main/Summary';
import TrackOrders from 'components/sections/ecommerce/customer/customer-account/main/TrackOrders';

const CustomerAccount = () => {
  return (
    <Grid container sx={{ flex: 1 }}>
      <Grid
        size={{
          xs: 12,
          md: 8,
          xl: 9,
        }}
      >
        <Stack
          direction="column"
          sx={{
            height: 1,
          }}
        >
          <GeneralInfo customerInfo={customerInfo} />
          <Grid container>
            <Grid
              size={{
                xs: 12,
                xl: 4,
              }}
            >
              <Summary stats={customerInfo.stats} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                xl: 8,
              }}
            >
              <TrackOrders orders={customerInfo.orderTracks} />
            </Grid>
            <Grid size={12}>
              <OrderStatus stats={customerInfo.stats} />
            </Grid>
          </Grid>
        </Stack>
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 4,
          xl: 3,
        }}
      >
        <AccountAside />
      </Grid>
    </Grid>
  );
};

export default CustomerAccount;
