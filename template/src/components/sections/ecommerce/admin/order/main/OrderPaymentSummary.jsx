import { Avatar, Button, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import IconifyIcon from 'components/base/IconifyIcon';
import { useOrderDetails } from '../OrderDetailsProvider';

const OrderPaymentSummary = () => {
  const { order } = useOrderDetails();
  const { currencyFormat } = useNumberFormat();
  const { payment } = order;

  return (
    <Paper sx={{ height: 1, p: { xs: 3, md: 5 } }}>
      <Container maxWidth={false} sx={{ maxWidth: 694, px: { xs: 0 } }}>
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <Stack
            sx={{
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Avatar
              variant="rounded"
              sx={{
                width: 36,
                height: 36,
                bgcolor: payment.status === 'unpaid' ? 'warning.lighter' : 'success.lighter',
                borderRadius: 2,
              }}
            >
              <IconifyIcon
                icon={
                  payment.status === 'unpaid'
                    ? 'material-symbols:warning-outline-rounded'
                    : 'material-symbols:check-rounded'
                }
                color={payment.status === 'unpaid' ? 'warning.main' : 'success.main'}
                fontSize={20}
              />
            </Avatar>

            <Typography variant="h6">{payment.status}</Typography>
          </Stack>

          <Button variant="soft" color="neutral">
            Mark as {payment.status === 'Paid' ? 'unpaid' : 'paid'}
          </Button>
        </Stack>

        <Stack
          direction="column"
          divider={<Divider flexItem />}
          sx={{
            gap: 2,
            bgcolor: 'background.elevation1',
            borderRadius: 6,
            p: 3,
          }}
        >
          <PriceSummaryRow label="Subtotal" value={payment.subtotal} />
          <PriceSummaryRow label="Shipping cost" value={payment.shippingCost} />
          <PriceSummaryRow label="Discount" value={payment.discount} />

          <Stack
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Total
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {currencyFormat(payment.total)}
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Paper>
  );
};

const PriceSummaryRow = ({ label, value, sx }) => {
  const { currencyFormat } = useNumberFormat();

  return (
    <Stack
      sx={{ justifyContent: 'space-between', alignItems: 'center', color: 'text.secondary', ...sx }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
        {label}
      </Typography>
      <Typography variant="subtitle2">{currencyFormat(value)}</Typography>
    </Stack>
  );
};

export default OrderPaymentSummary;
