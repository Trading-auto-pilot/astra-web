import { Box, Chip, Link, List, Stack, Typography } from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import paths from 'routes/paths';
import Image from 'components/base/Image';
import { statusColorMap } from 'components/sections/ecommerce/customer/order-list/OrderedItem';
import { useOrderDetails } from '../../order/OrderDetailsProvider';
import { OrderAttributeListItem } from '../../order/main/OrderItem';
import RefundItemTable from './RefundItemTable';

const RefundItem = ({ product, index }) => {
  const { order } = useOrderDetails();
  const { currencyFormat } = useNumberFormat();
  const { id, name, images, price, vendor, status, quantity, variants } = product;

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row', md: 'column', lg: 'row' }}
      sx={{
        gap: 3,
        width: 1,
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
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
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
            {vendor}
          </Box>
        </Typography>

        <Stack
          sx={{
            gap: 1,
            flexWrap: 'wrap',
            mb: 3,
            textTransform: 'capitalize',
          }}
        >
          <Chip variant="soft" color={statusColorMap[status.toLowerCase()]} label={status} />
          <Chip variant="soft" color="success" label={order?.payment.status} />
        </Stack>

        <Typography
          variant="subtitle2"
          sx={{
            color: 'text.secondary',
            mb: 2,
          }}
        >
          {currencyFormat(price.discounted)}
          <Box
            component="span"
            sx={{
              color: 'text.disabled',
              ml: 1,
            }}
          >
            x{quantity}
          </Box>
          <Box
            component="strong"
            sx={{
              ml: 2,
              fontSize: 'subtitle1.fontSize',
              color: 'text.primary',
            }}
          >
            {currencyFormat(price.discounted * quantity)}
          </Box>
        </Typography>

        <List dense disablePadding sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {variants.map((variant) => (
            <OrderAttributeListItem
              key={variant.label}
              label={variant.label}
              value={variant.value}
              sx={{
                color: 'text.secondary',
              }}
            />
          ))}
        </List>

        <RefundItemTable product={product} index={index} />
      </Box>
    </Stack>
  );
};

export default RefundItem;
