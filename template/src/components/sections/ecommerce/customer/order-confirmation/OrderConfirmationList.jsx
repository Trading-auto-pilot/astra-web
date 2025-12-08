import {
  Avatar,
  Box,
  Divider,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useEcommerce } from 'providers/EcommerceProvider';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';

const OrderConfirmationList = () => {
  const { cartItems } = useEcommerce();

  return (
    <List disablePadding>
      {cartItems.map((cartItem) => (
        <ListItem disableGutters key={cartItem.id} sx={{ gap: { xs: 1, sm: 3 } }}>
          <ListItemIcon sx={{ minWidth: 0 }}>
            <IconifyIcon icon="material-symbols:circle" color="divider" fontSize={10} />
          </ListItemIcon>
          <ListItemAvatar>
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: 'background.elevation1',
                width: 100,
                height: 100,
                p: 0.5,
              }}
              alt={cartItem.name}
              src={cartItem.images[0].src}
            />
          </ListItemAvatar>
          <ListItemText
            disableTypography
            primary={
              <>
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    fontWeight: 700,
                    lineClamp: 1,
                    mb: 0.5,
                  }}
                >
                  <Link
                    href={paths.productDetails(String(cartItem.id))}
                    sx={{
                      color: 'currentcolor',
                    }}
                  >
                    {cartItem.name}
                  </Link>
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 400,
                    mb: 2,
                  }}
                >
                  will be delivered to &nbsp;&nbsp;{' '}
                  <Box
                    component="strong"
                    sx={{
                      whiteSpace: 'nowrap',
                      ml: 0.5,
                    }}
                  >
                    Captain Haddock
                  </Box>
                </Typography>
              </>
            }
            secondary={
              <Stack
                divider={<Divider orientation="vertical" flexItem />}
                sx={{
                  columnGap: 3,
                  rowGap: 0.5,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    flexShrink: { xl: 0 },
                    fontWeight: 400,
                  }}
                >
                  Estimated date of delivery : &nbsp;&nbsp;{' '}
                  <Box
                    component="strong"
                    sx={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {dayjs().add(3, 'day').format('DD MMM, YYYY')}
                  </Box>
                </Typography>
              </Stack>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default OrderConfirmationList;
