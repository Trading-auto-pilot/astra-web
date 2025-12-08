import Box from '@mui/material/Box';
import ListContainer from 'components/sections/crm/deals/list-container/ListContainer';

const ListContainerOverlay = ({ dealList }) => {
  return (
    <Box sx={{ cursor: 'grabbing', height: 1, boxShadow: (theme) => theme.vars.shadows[5] }}>
      <ListContainer dealList={dealList} />
    </Box>
  );
};

export default ListContainerOverlay;
