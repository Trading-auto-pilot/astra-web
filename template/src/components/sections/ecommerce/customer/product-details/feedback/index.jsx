import { Box, Button, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import ProductRatings from './ProductRatings';
import ProductReviews from './ProductReviews';

const ProductFeedback = () => {
  return (
    <div>
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 5,
        }}
      >
        <Typography variant="h6">Ratings & Reviews</Typography>
        <Button
          variant="soft"
          color="neutral"
          sx={{ textTransform: 'none', gap: 0.5, minWidth: 0, px: { xs: 1, sm: 2 } }}
        >
          <IconifyIcon
            icon="material-symbols:border-color-outline-rounded"
            sx={{ fontSize: '20px !important' }}
          />
          <Box component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Rate This Product
          </Box>
        </Button>
      </Stack>
      <ProductRatings sx={{ mb: 5 }} />
      <ProductReviews />
    </div>
  );
};

export default ProductFeedback;
