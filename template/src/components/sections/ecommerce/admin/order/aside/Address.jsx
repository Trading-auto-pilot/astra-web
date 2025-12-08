import { Box, Button, Stack, Typography } from '@mui/material';
import { useOrderDetails } from '../OrderDetailsProvider';

const Address = ({ sx }) => {
  const { order } = useOrderDetails();
  const { customer } = order;

  return (
    <Box
      sx={{
        p: { xs: 3, md: 4, lg: 5 },
        ...sx,
      }}
    >
      <Box
        sx={{
          mb: 5,
        }}
      >
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
            }}
          >
            1 Shipping address
          </Typography>

          <Button variant="text" size="small" sx={{ flexShrink: 0, minWidth: 0 }}>
            Edit
          </Button>
        </Stack>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          {customer?.contactInfo.address.shipping}
        </Typography>
      </Box>
      <div>
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
            }}
          >
            1 Billing address
          </Typography>

          <Button variant="text" size="small" sx={{ flexShrink: 0, minWidth: 0 }}>
            Edit
          </Button>
        </Stack>

        <Typography
          variant="body2"
          sx={{
            color: 'text.disabled',
          }}
        >
          {customer?.contactInfo.address.billingAddressSameAsShipping
            ? 'Same as shipping address'
            : customer?.contactInfo.address.billing}
        </Typography>
      </div>
    </Box>
  );
};

export default Address;
