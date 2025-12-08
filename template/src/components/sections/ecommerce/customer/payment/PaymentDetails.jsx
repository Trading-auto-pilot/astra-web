import { Box, Stack, Typography } from '@mui/material';

const PaymentDetails = ({ sx }) => {
  return (
    <Stack gap={1} direction="column" sx={sx}>
      <PaymentDetailsItem label="Customer Name" value="Captain Haddock" />
      <PaymentDetailsItem label="Phone Number" value="+880 1423 4234 245" sx={{ mb: 1 }} />

      <PaymentDetailsItem
        label="Shipping Address"
        value="Apt: 6/B, 192 Edsel Road, Van Nuys, California, USA 96580"
      />
      <PaymentDetailsItem
        label="Billing Address"
        value="Apt: 6/B, 192 Edsel Road, Van Nuys, California, USA 96580"
        sx={{ mb: 1 }}
      />

      <PaymentDetailsItem label="Delivery Option" value="Standard DDP" />
    </Stack>
  );
};

const PaymentDetailsItem = ({ label, value, sx }) => {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{
        gap: 0.5,
        borderRadius: 2,
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.elevation2',
          p: 2,
          width: { sm: 180 },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
          }}
        >
          {label}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          bgcolor: 'background.elevation1',
          p: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
};

export default PaymentDetails;
