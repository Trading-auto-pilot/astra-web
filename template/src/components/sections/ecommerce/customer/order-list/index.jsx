import { useState } from 'react';
import { FormControl, MenuItem, Stack, Tab, Tabs, tabClasses } from '@mui/material';
import StyledTextField from 'components/styled/StyledTextField';
import OrderedItemList from './OrderedItemList';

const OrderListContainer = ({ orders }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [sortBy, setSortBy] = useState('last6Months');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const filterProducts = (status) => {
    return orders.flatMap((order) =>
      order.items
        .filter((item) => item.status === status)
        .map((item) => ({ ...item, orderId: order.id })),
    );
  };

  return (
    <div>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          justifyContent: 'space-between',
          gap: 3,
          mb: 3,
        }}
      >
        <FormControl sx={{ maxWidth: 300, width: 1, order: { sm: 1 } }}>
          <StyledTextField
            select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
            }}
          >
            <MenuItem value="last6Months">Last 6 months</MenuItem>
            <MenuItem value="last3Months">Last 3 months</MenuItem>
            <MenuItem value="lastMonth">Last month</MenuItem>
            <MenuItem value="lastWeek">Last week</MenuItem>
          </StyledTextField>
        </FormControl>

        <Tabs
          variant="scrollable"
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="order-list-tab"
          sx={{
            flexShrink: 0,
            [`& .${tabClasses.root}`]: {
              textTransform: 'none',
            },
          }}
        >
          <Tab label="All" />
          <Tab label="To pay" />
          <Tab label="To ship" />
          <Tab label="To recieve" />
          <Tab label="To review" />
        </Tabs>
      </Stack>
      <TabPanel value={selectedTab} index={0}>
        <OrderedItemList title="To pay" products={filterProducts('Pending')} />
        <OrderedItemList title="To ship" products={filterProducts('Processing')} />
        <OrderedItemList title="To recieve" products={filterProducts('Shipped')} />
        <OrderedItemList title="To review" products={filterProducts('Delivered')} />
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <OrderedItemList title="To pay" products={filterProducts('Pending')} />
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        <OrderedItemList title="To ship" products={filterProducts('Processing')} />
      </TabPanel>
      <TabPanel value={selectedTab} index={3}>
        <OrderedItemList title="To recieve" products={filterProducts('Shipped')} />
      </TabPanel>
      <TabPanel value={selectedTab} index={4}>
        <OrderedItemList title="To review" products={filterProducts('Delivered')} />
      </TabPanel>
    </div>
  );
};

const TabPanel = ({ value, index, children }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      <Stack
        direction="column"
        sx={{
          gap: 3,
        }}
      >
        {value === index && children}
      </Stack>
    </div>
  );
};

export default OrderListContainer;
