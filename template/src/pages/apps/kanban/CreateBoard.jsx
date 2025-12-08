import { Paper, Typography } from '@mui/material';
import CreateBoardStepper from 'components/sections/kanban/create-board/CreateBoardStepper';

const CreateBoard = () => {
  return (
    <Paper sx={{ p: { xs: 3, md: 5 }, height: 1 }}>
      <Typography variant="h5" sx={{ fontWeight: 500, mb: 3 }}>
        New Kanban Board
      </Typography>
      <CreateBoardStepper />
    </Paper>
  );
};

export default CreateBoard;
