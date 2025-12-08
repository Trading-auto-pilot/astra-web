import { Button, Stack, Typography } from '@mui/material';
import paths from 'routes/paths';
import OrderConfirmationList from './OrderConfirmationList';

const OrderConfirmationPreview = () => {
  return (
    <Stack
      direction="column"
      sx={{
        gap: 5,
      }}
    >
      <div>
        <Typography
          variant="h4"
          sx={{
            mb: 1,
          }}
        >
          Thank you for purchasing
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: 'success.main',
            mb: 3,
          }}
        >
          Your order has been placed!
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            mb: 1,
          }}
        >
          Order #1411241235
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
          }}
        >
          We’ve sent a confirmation email to your inbox
        </Typography>
      </div>
      <OrderConfirmationList />
      <Stack
        sx={{
          gap: 1,
        }}
      >
        <Button variant="soft" color="neutral">
          Order list
        </Button>
        <Button variant="contained" color="primary" href={paths.products}>
          Browse more items
        </Button>
      </Stack>
    </Stack>
  );
};

export default OrderConfirmationPreview;
