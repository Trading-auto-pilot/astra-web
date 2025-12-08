import Box from '@mui/material/Box';
import ListContainer from './ListContainer';

const ListContainerOverlay = ({ list }) => {
  return (
    <Box sx={{ cursor: 'grabbing', height: 1, boxShadow: (theme) => theme.vars.shadows[5] }}>
      <ListContainer list={list} />
    </Box>
  );
};

export default ListContainerOverlay;
