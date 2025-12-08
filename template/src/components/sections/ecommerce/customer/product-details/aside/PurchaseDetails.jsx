import { Box, Link, Paper, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const PurchaseDetails = ({ sx }) => {
  return (
    <Paper sx={{ p: { xs: 3, md: 5 }, ...sx }}>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
        }}
      >
        Purchase details
      </Typography>
      <Stack
        sx={{
          gap: 2,
          mb: 3,
        }}
      >
        <IconifyIcon
          icon="material-symbols:local-shipping-outline-rounded"
          sx={{ flexShrink: 0, fontSize: 22 }}
        />
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Home delivery and store pickup
          <Box
            sx={{
              display: 'block',
              fontWeight: 700,
              color: 'success.main',
            }}
            component="span"
          >
            Both available
          </Box>
        </Typography>
      </Stack>
      <Stack
        sx={{
          gap: 2,
        }}
      >
        <IconifyIcon
          icon="material-symbols:u-turn-left-rounded"
          sx={{ flexShrink: 0, fontSize: 22, rotate: '90deg' }}
        />
        <div>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            <strong>Eligible for refund within 30 days</strong> of receiving products.{' '}
            <Link href="#!">View details.</Link>
          </Typography>
        </div>
      </Stack>
    </Paper>
  );
};

export default PurchaseDetails;
