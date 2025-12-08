import { Box, Chip, Rating, Stack, Typography, ratingClasses } from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import { useEcommerce } from 'providers/EcommerceProvider';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import PageBreadcrumb from '../../../common/PageBreadcrumb';

const GeneralInfo = ({ sx }) => {
  const { product } = useEcommerce();
  const { numberFormat } = useNumberFormat();

  return (
    <Box sx={{ ...sx }}>
      <PageBreadcrumb
        items={[
          { label: 'Home', url: paths.ecommerceHomepage },
          { label: 'Living room', url: '#!' },
          { label: 'Armchair', active: true },
        ]}
        sx={{ mb: { xl: 5, xs: 3 } }}
      />
      <Stack
        direction={{ xs: 'column', lg: 'row', xl: 'column' }}
        sx={{
          justifyContent: 'space-between',
          gap: 3,
        }}
      >
        <Typography variant="h1" sx={{ fontSize: 'h5.fontSize' }}>
          {product?.name}
        </Typography>
        <Stack
          direction={{ xs: 'row', lg: 'column', xl: 'row' }}
          sx={{
            rowGap: 1,
            columnGap: 3,
            alignItems: { xs: 'center', lg: 'flex-end', xl: 'center' },
          }}
        >
          <Chip
            variant="soft"
            color="warning"
            label="Top Seller"
            icon={<IconifyIcon icon="material-symbols:stars-rounded" fontSize={16} />}
          />
          <Stack
            sx={{
              gap: 1,
              alignItems: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            <Rating
              name="product-rating"
              color="warning"
              value={product?.ratings}
              readOnly
              icon={<IconifyIcon icon="material-symbols:star-rounded" />}
              sx={{
                [`& .${ratingClasses.iconFilled}`]: {
                  color: 'warning.main',
                },
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.secondary',
              }}
            >
              ({numberFormat(product?.reviews || 0)} reviews)
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default GeneralInfo;
