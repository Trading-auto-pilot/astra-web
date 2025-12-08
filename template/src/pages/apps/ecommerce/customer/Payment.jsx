import { Box, Container, Divider, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import paths from 'routes/paths';
import CartSummary from 'components/sections/ecommerce/customer/checkout/aside/CartSummary';
import PageHeader from 'components/sections/ecommerce/customer/common/PageHeader';
import PaymentSummary from 'components/sections/ecommerce/customer/common/PaymentSummary';
import PaymentBottomBar from 'components/sections/ecommerce/customer/payment/PaymentBottomBar';
import PaymentDetails from 'components/sections/ecommerce/customer/payment/PaymentDetails';
import PaymentMethods from 'components/sections/ecommerce/customer/payment/PaymentMethods';

const Payment = () => {
  return (
    <Grid container>
      <Grid size={12}>
        <PageHeader
          title="Payment"
          breadcrumb={[
            { label: 'Cart', url: paths.cart },
            { label: 'Checkout', url: paths.checkout },
            { label: 'Payment', active: true },
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
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: 'success.main',
                mb: 1,
              }}
            >
              Your order has been placed!
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
              }}
            >
              <Box
                component="span"
                sx={{
                  fontWeight: 400,
                  color: 'text.secondary',
                }}
              >
                Order ID{' '}
              </Box>
              #51253134
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.secondary',
                mb: 3,
              }}
            >
              A confirmation email has been sent to <strong>hello@email.com</strong>
            </Typography>
            <PaymentDetails sx={{ mb: 7 }} />
            <PaymentMethods />
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
        <PaymentBottomBar />
      </Grid>
    </Grid>
  );
};

export default Payment;
