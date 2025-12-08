import { useState } from 'react';
import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
  listClasses,
  menuClasses,
} from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

const statusColorMap = {
  pending: 'neutral',
  queued: 'primary',
  shipped: 'warning',
  cancelled: 'error',
  delivered: 'success',
};

const OrderItem = ({ item }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(item.status);
  const { currencyFormat } = useNumberFormat();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (status) => {
    setCurrentStatus(status);
    handleClose();
  };

  const { id, name, images, price } = item;

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{
        gap: 3,
      }}
    >
      <Box
        sx={{
          width: 100,
          height: 100,
          flexShrink: 0,
          bgcolor: 'background.elevation1',
          borderRadius: 4,
        }}
      >
        <Image src={images[0].src} alt="" sx={{ width: 1, objectFit: 'contain' }} />
      </Box>
      <div>
        <Typography
          variant="subtitle1"
          sx={{
            flex: 1,
            fontWeight: 700,
            lineClamp: 2,
            mb: 2,
          }}
        >
          <Link
            href={paths.productDetails(String(id))}
            sx={{
              color: 'currentcolor',
            }}
          >
            {name}
          </Link>
        </Typography>

        <Typography
          component="p"
          variant="caption"
          sx={{
            color: 'text.secondary',
            mb: 3,
          }}
        >
          Sold by{' '}
          <Box
            component="span"
            sx={{
              fontWeight: 500,
              color: 'text.primary',
            }}
          >
            {item.vendor}
          </Box>
        </Typography>

        <Box
          sx={{
            mb: 3,
          }}
        >
          <Button
            variant="soft"
            size="small"
            color={statusColorMap[currentStatus.toLowerCase()]}
            id="order-status-button"
            aria-haspopup="true"
            aria-controls={open ? 'order-status-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{ borderRadius: 25, textTransform: 'capitalize' }}
            endIcon={<IconifyIcon icon="material-symbols:keyboard-arrow-down-rounded" />}
          >
            {currentStatus}
          </Button>
          <Menu
            id="order-status-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{
              [`& .${menuClasses.paper}`]: {
                [`& .${listClasses.root}`]: {
                  minWidth: 140,
                },
              },
            }}
            slotProps={{
              list: {
                'aria-labelledby': 'action-button',
              },
            }}
          >
            {['Pending', 'Queued', 'Shipped', 'Cancelled', 'Delivered'].map((status) => (
              <MenuItem key={status} onClick={() => handleMenuItemClick(status)}>
                {status}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <Typography
          variant="subtitle2"
          sx={{
            color: 'text.secondary',
            mb: 2,
            display: 'flex',
            gap: 1,
          }}
        >
          {currencyFormat(price.discounted)}
          <Box
            component="span"
            sx={{
              color: 'text.disabled',
            }}
          >
            x{item.quantity}
          </Box>
          <Box
            component="strong"
            sx={{
              ml: 1,
              color: 'text.primary',
            }}
          >
            {currencyFormat(price.discounted * item.quantity)}
          </Box>
        </Typography>

        <List dense disablePadding sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {item.variants.map((variant) => (
            <OrderAttributeListItem
              key={variant.label}
              label={variant.label}
              value={variant.value}
            />
          ))}
        </List>

        <List dense disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <OrderAttributeListItem label="Shipping address" value={item.shippingAddress} />
          <OrderAttributeListItem
            label="Billing address"
            value={
              item.billingAddressSameAsShipping ? 'Same as shipping address' : item.billlingAddress
            }
            sx={[
              item.billingAddressSameAsShipping && {
                color: 'text.disabled',
              },
            ]}
          />
        </List>
      </div>
    </Stack>
  );
};

export default OrderItem;

export const OrderAttributeListItem = ({ label, value, sx }) => {
  return (
    <ListItem disablePadding disableGutters>
      <ListItemText
        sx={{ m: 0, display: 'flex', gap: 1 }}
        primary={
          <Typography
            component="p"
            variant="caption"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
              minWidth: 120,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {label}
            <span>:</span>
          </Typography>
        }
        secondary={
          <Typography component="p" variant="caption" sx={sx}>
            {value}
          </Typography>
        }
      />
    </ListItem>
  );
};
