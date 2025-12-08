import Box from '@mui/material/Box';
import ListContainer from '../list-container/ListContainer';

const ListContainerOverlay = ({ taskList }) => {
  return (
    <Box sx={{ cursor: 'grabbing', height: 1, boxShadow: (theme) => theme.vars.shadows[5] }}>
      <ListContainer taskList={taskList} />
    </Box>
  );
};

export default ListContainerOverlay;
