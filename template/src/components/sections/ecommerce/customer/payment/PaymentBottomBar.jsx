import { Button, Paper, Stack, Typography } from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useEcommerce } from 'providers/EcommerceProvider';

const PaymentBottomBar = () => {
  const { cartItems, cartTotal } = useEcommerce();
  const { up } = useBreakpoints();
  const upSm = up('sm');
  const { currencyFormat } = useNumberFormat();

  return (
    <Paper background={2} sx={{ py: 1, px: { xs: 3, md: 5 } }}>
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {upSm && (
          <Typography
            variant="subtitle1"
            sx={{
              flex: 1,
            }}
          >
            {cartItems.length} item{cartItems.length > 1 ? 's' : ''} selected
          </Typography>
        )}
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: { xs: 1, sm: 'unset' },
            gap: { xs: 3, md: 8 },
          }}
        >
          <Stack
            sx={{
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: 'text.secondary',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Total
            </Typography>
            <Typography variant="h4">{currencyFormat(cartTotal)}</Typography>
          </Stack>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            form="paymentForm"
            sx={{
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            Submit order
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default PaymentBottomBar;
