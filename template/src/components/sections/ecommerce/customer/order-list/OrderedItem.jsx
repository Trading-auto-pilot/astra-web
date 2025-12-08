import {
  Box,
  Button,
  Chip,
  Link,
  List,
  Stack,
  Typography,
  listItemTextClasses,
} from '@mui/material';
import dayjs from 'dayjs';
import useNumberFormat from 'hooks/useNumberFormat';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import ProductVariantListItem from '../../admin/common/ProductVariantListItem';

export const statusColorMap = {
  Pending: 'neutral',
  Processing: 'primary',
  Shipped: 'warning',
  Delivered: 'success',
};

const OrderedItem = ({ product }) => {
  const { down } = useBreakpoints();
  const downSm = down('sm');
  const { currencyFormat } = useNumberFormat();
  const { orderId, id, name, images, price, status } = product;

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        gap: 5,
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: { xs: 1, md: 240 },
          maxWidth: 240,
          flexShrink: 0,
        }}
      >
        <Image
          src={images[0].src}
          alt=""
          sx={{
            width: 1,
            objectFit: 'contain',
          }}
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          width: 1,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            gap: 3,
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <div>
            <Typography
              variant="subtitle1"
              sx={{
                flex: 1,
                fontWeight: 700,
                lineClamp: 1,
                mb: 1,
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
                mb: 2,
              }}
            >
              Order {orderId}
            </Typography>

            <Typography
              component="p"
              variant="caption"
              sx={{
                color: 'text.secondary',
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
                {product.vendor}
              </Box>
            </Typography>
          </div>

          <Stack
            direction={{ xs: 'row', sm: 'column' }}
            sx={{
              gap: 2,
              flexShrink: 0,
              textAlign: { xs: 'left', sm: 'right' },
              alignItems: { xs: 'flex-start', sm: 'flex-end' },
            }}
          >
            {status !== 'Delivered' && (
              <div>
                <Typography
                  variant="caption"
                  component="p"
                  sx={{
                    fontWeight: 700,
                    color: 'text.secondary',
                    mb: 1,
                  }}
                >
                  Estimated date of delivery
                </Typography>
                <Typography
                  variant="caption"
                  component="p"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  {dayjs()
                    .subtract(Math.floor(Math.random() * 30) + 1, 'day')
                    .format('DD MMM')}
                  -
                  {dayjs()
                    .subtract(Math.floor(Math.random() * 30) + 1, 'day')
                    .add(3, 'day')
                    .format('DD MMM')}
                </Typography>
              </div>
            )}
            <Chip
              variant="filled"
              color={statusColorMap[status ?? 'default']}
              label={status}
              sx={{ textTransform: 'capitalize' }}
            />
          </Stack>
        </Stack>

        <Stack
          direction={{ xs: 'column', xl: 'row' }}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xl: 'flex-end' },
            rowGap: 4,
          }}
        >
          <div>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              {currencyFormat(price.discounted)}
            </Typography>

            <List dense disablePadding>
              {product.variants?.map((variant) => (
                <ProductVariantListItem
                  key={variant.label}
                  label={variant.label}
                  value={variant.value}
                  sx={{
                    mb: 1,
                    [`& .${listItemTextClasses.primary}`]: {
                      minWidth: 85,
                    },
                  }}
                />
              ))}
            </List>
          </div>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{
              gap: 2,
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              sx={{
                gap: 1,
                alignItems: 'center',
                width: 1,
              }}
            >
              <Stack
                sx={{
                  gap: 1,
                  width: { xs: 1, sm: 'auto' },
                }}
              >
                <Button
                  size="small"
                  fullWidth={downSm}
                  href={paths.orderDetails}
                  variant="soft"
                  color="neutral"
                  startIcon={
                    <IconifyIcon
                      icon="material-symbols:info-outline-rounded"
                      fontSize="18px !important"
                    />
                  }
                >
                  Details
                </Button>

                <Button
                  size="small"
                  fullWidth={downSm}
                  href={paths.orderTrack}
                  variant="soft"
                  color="neutral"
                  startIcon={
                    <IconifyIcon
                      icon="material-symbols:inventory-2-outline-rounded"
                      fontSize="18px !important"
                    />
                  }
                >
                  Track
                </Button>
              </Stack>

              <Button
                size="small"
                fullWidth={downSm}
                variant="soft"
                color="neutral"
                startIcon={
                  <IconifyIcon
                    icon="material-symbols:chat-outline-rounded"
                    fontSize="18px !important"
                  />
                }
              >
                Chat with seller
              </Button>
            </Stack>

            <Button
              variant="text"
              color="error"
              size="small"
              sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              Cancel order
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

export default OrderedItem;
