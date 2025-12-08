import { Button, Paper, Stack, Typography } from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useEcommerce } from 'providers/EcommerceProvider';
import paths from 'routes/paths';

const CartBottomBar = () => {
  const { cartItems, cartTotal } = useEcommerce();
  const { up } = useBreakpoints();
  const { currencyFormat } = useNumberFormat();
  const upSm = up('sm');

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
                display: { xs: 'none', md: 'block' },
              }}
            >
              Total
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: { xs: 700 } }}>
              {currencyFormat(cartTotal)}
            </Typography>
          </Stack>
          <Button
            color="primary"
            variant="contained"
            href={paths.checkout}
            sx={{
              flexShrink: 0,
              whiteSpace: 'nowrap',
              px: { xs: 3, sm: 6 },
            }}
          >
            Checkout as guest
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default CartBottomBar;
