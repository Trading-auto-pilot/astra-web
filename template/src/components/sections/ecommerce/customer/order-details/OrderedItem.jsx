import { Box, Button, Chip, Link, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import useNumberFormat from 'hooks/useNumberFormat';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import { statusColorMap } from '../order-list/OrderedItem';
import ProductAttributeRow from './ProductAttributeRow';

const OrderedItem = ({ product, customer }) => {
  const { id, name, price, images, status, quantity, vendor } = product;
  const { currencyFormat } = useNumberFormat();

  return (
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      sx={{
        gap: 5,
        alignItems: 'stretch',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: { xs: 1, lg: 320, xl: 400 },
          flexShrink: 0,
          bgcolor: 'background.elevation1',
          borderRadius: 6,
        }}
      >
        <Image
          src={images[0].src}
          alt=""
          sx={{
            width: 1,
            maxWidth: { xs: 360, lg: 'unset' },
            alignSelf: 'center',
            justifySelf: 'center',
            objectFit: 'contain',
          }}
        />
      </Box>
      <Stack
        direction="column"
        sx={{
          gap: 4,
        }}
      >
        <div>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
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
            }}
          >
            Sold by
            <Box
              component="span"
              sx={{
                ml: 1,
                fontWeight: 500,
                color: 'text.primary',
              }}
            >
              {vendor}
            </Box>
          </Typography>
        </div>

        <div>
          <Chip
            variant="filled"
            color={statusColorMap[status ?? 'default']}
            label={status}
            sx={{ textTransform: 'capitalize' }}
          />
        </div>

        <Stack
          sx={{
            gap: 1,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Button
            variant="soft"
            color="primary"
            startIcon={
              <IconifyIcon
                icon="material-symbols:edit-outline-rounded"
                fontSize="20px !important"
              />
            }
          >
            Write a review
          </Button>
          <Button
            variant="soft"
            color="neutral"
            startIcon={
              <IconifyIcon
                icon="material-symbols:chat-outline-rounded"
                fontSize="20px !important"
              />
            }
          >
            Get product support
          </Button>
        </Stack>

        <div>
          <Typography
            variant="subtitle2"
            sx={{
              color: 'text.secondary',
              mb: 1,
            }}
          >
            Each{' '}
            <Box
              component="strong"
              sx={{
                color: 'text.primary',
                ml: 1,
              }}
            >
              {currencyFormat(price.discounted)}
            </Box>
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              color: 'text.secondary',
              mb: 2,
            }}
          >
            Quantity:{' '}
            <Box
              component="strong"
              sx={{
                color: 'text.primary',
                ml: 1,
              }}
            >
              {quantity}
            </Box>
          </Typography>
          <Stack
            sx={{
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.secondary',
              }}
            >
              Total
            </Typography>
            <Typography variant="h5">{currencyFormat(price.discounted * quantity)}</Typography>
          </Stack>
        </div>

        <Grid container spacing={4}>
          <Grid size={12} container spacing={0.5}>
            <Grid size={12}>
              <ProductAttributeRow label="Category" value={product.category?.join(',') || ''} />
            </Grid>
            <Grid size={12}>
              <ProductAttributeRow
                label="Fabric Material"
                value={product.material?.join(',') || ''}
              />
            </Grid>
            {product.variants.map((variant) => (
              <Grid size={12} key={variant.label}>
                <ProductAttributeRow
                  key={variant.label}
                  label={variant.label}
                  value={variant.value}
                />
              </Grid>
            ))}
          </Grid>

          <Grid size={12} container spacing={0.5}>
            <Grid size={12}>
              <ProductAttributeRow label="Shipping Address" value={product.shippingAddress} />
            </Grid>
            <Grid size={12}>
              <ProductAttributeRow label="Billing Address" value={product.billlingAddress} />
            </Grid>
            {customer && (
              <Grid size={12}>
                <ProductAttributeRow label="Phone Number" value={customer?.contactInfo.phone} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
};

export default OrderedItem;
