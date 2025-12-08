import { Box, Button, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import { useEcommerce } from 'providers/EcommerceProvider';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import CartItem from './CartItem';

const ActionButtons = ({ sx }) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    sx={{
      gap: 2,
      ...sx,
    }}
  >
    <Button
      variant="soft"
      color="primary"
      href={paths.products}
      startIcon={
        <IconifyIcon icon="material-symbols:chevron-left-rounded" fontSize="20px !important" />
      }
    >
      Continue shopping
    </Button>
    <Button
      variant="soft"
      color="neutral"
      startIcon={
        <IconifyIcon icon="material-symbols:favorite-outline-rounded" fontSize="20px !important" />
      }
    >
      Move all items into wishlist
    </Button>
  </Stack>
);

const CartMain = () => {
  const { cartItems } = useEcommerce();
  const { currencyFormat } = useNumberFormat();

  return (
    <Paper sx={{ height: 1, px: { xs: 3, md: 5 }, py: 5 }}>
      <Container maxWidth="md" sx={{ px: { xs: 0 } }}>
        <Typography
          variant="h3"
          sx={{
            color: 'success.main',
            mb: 5,
          }}
        >
          Excellent choices!
        </Typography>

        <ActionButtons sx={{ mb: 5 }} />

        <Stack
          direction="column"
          sx={{
            gap: 5,
            mb: 5,
          }}
        >
          {cartItems.map((cartItem) => (
            <CartItem key={cartItem.id} item={cartItem} />
          ))}
        </Stack>

        <Box sx={{ mb: 5 }}>
          <Divider sx={{ mb: 1 }} />
          <Stack
            sx={{ justifyContent: 'space-between', alignItems: 'center', px: { xs: 3, md: 5 } }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
            </Typography>

            <Stack spacing={{ xs: 3, md: 5 }} sx={{ alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                total
              </Typography>
              <Typography variant="h5">
                {currencyFormat(
                  cartItems.reduce((sum, item) => sum + item.price.discounted * item.quantity, 0),
                )}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <ActionButtons />
      </Container>
    </Paper>
  );
};

export default CartMain;
