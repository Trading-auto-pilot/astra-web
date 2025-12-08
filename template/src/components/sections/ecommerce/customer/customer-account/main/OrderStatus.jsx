import { useMemo } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import IconifyIcon from 'components/base/IconifyIcon';

const OrderStatus = ({ stats }) => {
  const orderStatusItems = useMemo(() => {
    return [
      {
        label: 'To Pay',
        icon: 'material-symbols:credit-card-outline',
        field: 'toPay',
        url: '#!',
        count: stats.toPay,
      },
      {
        label: 'To Ship',
        icon: 'material-symbols:local-shipping-outline-rounded',
        field: 'toShip',
        url: '#!',
        count: stats.toShip,
      },
      {
        label: 'To Receive',
        field: 'toReceive',
        icon: 'material-symbols:package-2-outline',
        url: '#!',
        count: stats.toReceive,
      },
      {
        label: 'To Review',
        field: 'toReview',
        icon: 'material-symbols:reviews-outline-rounded',
        url: '#!',
        count: stats.toReview,
      },
    ];
  }, [stats]);

  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
        }}
      >
        Order status
      </Typography>
      <nav aria-label="Order status">
        <Grid container component={List} disablePadding spacing={2}>
          {orderStatusItems.map(({ label, icon, url, count }) => (
            <Grid
              component={ListItem}
              key={label}
              disablePadding
              size={{
                xs: 6,
                lg: 3,
              }}
            >
              <ListItemButton
                href={url}
                sx={{
                  py: 6,
                  gap: 2,
                  borderRadius: 6,
                  flexDirection: 'column',
                  bgcolor: 'background.elevation1',
                  '&:hover': { bgcolor: 'background.elevation2' },
                }}
              >
                <ListItemIcon>
                  <IconifyIcon icon={icon} fontSize={48} color="primary.main" />
                </ListItemIcon>
                <ListItemText
                  sx={{ m: 0 }}
                  primary={
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                      }}
                    >
                      {label}{' '}
                      {count > 0 && (
                        <Box
                          component="span"
                          sx={{
                            color: 'error.main',
                          }}
                        >
                          ({count})
                        </Box>
                      )}
                    </Typography>
                  }
                />
              </ListItemButton>
            </Grid>
          ))}
        </Grid>
      </nav>
    </Paper>
  );
};

export default OrderStatus;
