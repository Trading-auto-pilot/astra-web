import { Box, Divider, Stack, Typography } from '@mui/material';
import OrderedItem from './OrderedItem';

const OrderedItemList = ({ title, products }) => {
  if (!products.length) return;

  return (
    <Box
      sx={{
        bgcolor: 'background.elevation1',
        borderRadius: 6,
        p: { xs: 3, md: 5 },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 2,
        }}
      >
        {title}
      </Typography>
      <Divider sx={{ mb: 5 }} />
      <Stack direction="column" divider={<Divider sx={{ my: 5 }} />}>
        {products.map((product) => (
          <OrderedItem key={product.id} product={product} />
        ))}
      </Stack>
    </Box>
  );
};

export default OrderedItemList;
