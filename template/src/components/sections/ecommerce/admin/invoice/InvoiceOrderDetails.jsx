import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

const InvoiceOrderDetails = ({ invoice }) => {
  const { order } = invoice;

  return (
    <div>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
        }}
      >
        Order details
      </Typography>

      <Stack direction="column" gap={3}>
        <Grid container spacing={1}>
          <Grid size={6}>
            <OrderDetailItem label="Order ID" value={order.id} />
          </Grid>
          <Grid size={6}>
            <OrderDetailItem label="Invoice ID" value="#52132463423234" />
          </Grid>
          <Grid size={6}>
            <OrderDetailItem label="Deliver to" value="Captain Haddock" />
          </Grid>
          <Grid size={6}>
            <OrderDetailItem label="Phone" value="+12324354356" />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid size={6}>
            <OrderDetailItem label="Order date" value="8:30 pm, 19 March 2024" />
          </Grid>
          <Grid size={6}>
            <OrderDetailItem label="Payment status" value="Paid" />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid size={6}>
            <OrderDetailItem label="Paid by" value="Captain Haddock" />
          </Grid>
          <Grid size={6}>
            <OrderDetailItem label="Bill to" value="Captain Haddock" />
          </Grid>
          <Grid size={6}>
            <OrderDetailItem
              label="Delivery address"
              value="Apt: 6/B, 192 Edsel Road, Van Nuys, California, USA 96580"
            />
          </Grid>
          <Grid size={6}>
            <OrderDetailItem
              label="Billing address"
              value="Apt: 6/B, 192 Edsel Road, Van Nuys, California, USA 96580"
            />
          </Grid>
        </Grid>
      </Stack>
    </div>
  );
};

const OrderDetailItem = ({ label, value }) => (
  <Stack sx={{ alignItems: 'center' }}>
    <Typography variant="body2" sx={{ fontWeight: 'bold', width: 120 }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary', pl: 2, pr: 3 }}>
      :
    </Typography>
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {value}
    </Typography>
  </Stack>
);

export default InvoiceOrderDetails;
