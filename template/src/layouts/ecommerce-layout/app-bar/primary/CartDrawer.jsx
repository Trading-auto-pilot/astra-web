import { Box, Button, Drawer, FormGroup, Stack, Typography, drawerClasses } from '@mui/material';
import { useEcommerce } from 'providers/EcommerceProvider';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import CartItemsFallback from 'components/sections/ecommerce/customer/cart/CartItemsFallback';
import CartItem from './CartItem';

const CartDrawer = ({ open, handleClose }) => {
  const { cartItems, removeItemFromCart } = useEcommerce();

  const handleItemRemove = (id) => {
    removeItemFromCart(id);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          maxWidth: 500,
          width: 1,
          bgcolor: 'background.elevation1',
        },
      }}
    >
      <Stack
        direction="column"
        sx={{
          height: 1,
          justifyContent: 'space-between',
        }}
      >
        <Stack
          sx={{
            px: { xs: 3, sm: 5 },
            pt: 5,
            pb: 4,
            bgcolor: 'background.elevation1',
            position: 'sticky',
            zIndex: 10,
            top: 0,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4">Cart</Typography>
          <Button variant="soft" color="neutral" shape="circle" onClick={handleClose}>
            <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 18 }} />
          </Button>
        </Stack>
        <Box
          sx={{
            px: { xs: 3, sm: 5 },
            flexGrow: 1,
          }}
        >
          {cartItems.length > 0 ? (
            <FormGroup>
              <Stack
                direction="column"
                sx={{
                  gap: 5,
                }}
              >
                {cartItems.map((cartItem) => (
                  <CartItem key={cartItem.id} item={cartItem} handleRemove={handleItemRemove} />
                ))}
              </Stack>
            </FormGroup>
          ) : (
            <CartItemsFallback handleDrawerClose={handleClose} />
          )}
        </Box>
        {cartItems.length > 0 && (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{
              gap: 1,
              px: { xs: 3, sm: 5 },
              pb: 5,
              pt: 3,
              position: 'sticky',
              bottom: 0,
              bgcolor: 'background.elevation1',
            }}
          >
            <Button
              variant="soft"
              color="neutral"
              href={paths.cart}
              onClick={handleClose}
              sx={{ flex: 1 }}
            >
              Go to cart
            </Button>
            <Button variant="contained" color="primary" sx={{ flex: 1 }}>
              Proceed to payment
            </Button>
          </Stack>
        )}
      </Stack>
    </Drawer>
  );
};

export default CartDrawer;
