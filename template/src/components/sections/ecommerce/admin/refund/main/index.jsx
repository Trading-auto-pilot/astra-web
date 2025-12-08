import { Paper, Stack } from '@mui/material';
import { useOrderDetails } from '../../order/OrderDetailsProvider';
import RefundItem from './RefundItem';

const RefundContainer = () => {
  const { order } = useOrderDetails();
  const { items } = order;

  return (
    <Paper sx={{ height: 1, p: { xs: 3, md: 5 } }}>
      <Stack
        direction="column"
        sx={{
          width: 1,
          gap: 5,
        }}
      >
        {items.map((item, index) => (
          <RefundItem key={item.id} index={index} product={item} />
        ))}
      </Stack>
    </Paper>
  );
};

export default RefundContainer;
