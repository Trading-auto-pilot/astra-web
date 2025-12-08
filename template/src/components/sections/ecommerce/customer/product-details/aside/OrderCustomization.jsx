import { Button, Paper, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const OrderCustomization = ({ sx }) => {
  return (
    <Paper sx={{ p: { xs: 3, md: 5 }, ...sx }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
        }}
      >
        Need customization?
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mb: 3,
        }}
      >
        Have this product modified to your specifications, or have unique, personalized designs made
        according to your specifications.
      </Typography>
      <Button
        variant="soft"
        color="neutral"
        fullWidth
        startIcon={
          <IconifyIcon icon="material-symbols:handyman-outline" fontSize="20px !important" />
        }
      >
        Order Customization
      </Button>
    </Paper>
  );
};

export default OrderCustomization;
