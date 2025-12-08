import Stack from '@mui/material/Stack';
import AddNewDeal from 'components/sections/crm/deals/deal-card/AddNewDeal';
import SortableDealItem from 'components/sections/crm/deals/deal-card/SortableDealItem';

const DealItems = ({ listId, deals }) => {
  return (
    <Stack direction="column" sx={{ gap: 2, p: 2, pb: 3 }}>
      {deals.map((item) => (
        <SortableDealItem key={item.id} deal={item} />
      ))}
      <AddNewDeal listId={listId} />
    </Stack>
  );
};

export default DealItems;
