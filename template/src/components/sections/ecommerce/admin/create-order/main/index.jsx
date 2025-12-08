import { useState } from 'react';
import {
  Button,
  Container,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Divider } from '@mui/material';
import { orderDetailsList } from 'data/e-commerce/orders';
import IconifyIcon from 'components/base/IconifyIcon';
import CreateOrderItem from './CreateOrderItem';
import CreateOrderPaymentSummary from './CreateOrderPaymentSummary';

const CreateOrderContainer = () => {
  const [createOrderItems, setCreateOrderItems] = useState(orderDetailsList[0].items);

  return (
    <Paper sx={{ height: 1, flex: 1, p: { xs: 3, md: 5 } }}>
      <Container maxWidth="sm" sx={{ px: { xs: 0 } }}>
        <Stack direction="column" spacing={5}>
          <div>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Search to add an item
            </Typography>
            <TextField
              fullWidth
              id="searchItem"
              type="search"
              label="Search for an item..."
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:search-rounded" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>

          <Stack
            direction="column"
            spacing={3}
            divider={<Divider flexItem orientation="horizontal" />}
          >
            {createOrderItems.map((item) => (
              <CreateOrderItem key={item.id} orderItem={item} setOrderItems={setCreateOrderItems} />
            ))}
          </Stack>

          <CreateOrderPaymentSummary items={createOrderItems} />

          <Button variant="contained" sx={{ alignSelf: 'flex-end' }}>
            Email invoice
          </Button>
        </Stack>
      </Container>
    </Paper>
  );
};

export default CreateOrderContainer;
