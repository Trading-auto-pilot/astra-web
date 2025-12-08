import { Box, Container, Divider, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import paths from 'routes/paths';
import CheckoutBottomBar from 'components/sections/ecommerce/customer/checkout/CheckoutBottomBar';
import CartSummary from 'components/sections/ecommerce/customer/checkout/aside/CartSummary';
import ExpressCheckout from 'components/sections/ecommerce/customer/checkout/main/ExpressCheckout';
import CheckoutStepper from 'components/sections/ecommerce/customer/checkout/main/checkout-stepper/CheckoutStepper';
import PageHeader from 'components/sections/ecommerce/customer/common/PageHeader';
import PaymentSummary from 'components/sections/ecommerce/customer/common/PaymentSummary';

const Checkout = () => {
  return (
    <Grid container>
      <Grid size={12}>
        <PageHeader
          title="Checkout"
          breadcrumb={[
            { label: 'Home', url: paths.ecommerceHomepage },
            { label: 'Cart', url: paths.cart },
            { label: 'Checkout', active: true },
          ]}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 8,
          xl: 9,
        }}
      >
        <Paper sx={{ height: 1, px: { xs: 3, md: 5 }, py: { xs: 5, md: 8 } }}>
          <Container maxWidth="sm" sx={{ px: { xs: 0 } }}>
            <ExpressCheckout sx={{ mb: 7 }} />
            <CheckoutStepper />
          </Container>
        </Paper>
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 4,
          xl: 3,
        }}
      >
        <Paper background={1} sx={{ height: 1 }}>
          <Box
            sx={(theme) => ({
              position: 'sticky',
              top: theme.mixins.ecommerceTopbar,
              p: { xs: 3, md: 5 },
            })}
          >
            <CartSummary />
            <Divider sx={{ my: 4 }} />
            <PaymentSummary />
          </Box>
        </Paper>
      </Grid>
      <Grid sx={{ position: 'sticky', zIndex: 999, width: 1, bottom: 0 }} size={12}>
        <CheckoutBottomBar />
      </Grid>
    </Grid>
  );
};

export default Checkout;
