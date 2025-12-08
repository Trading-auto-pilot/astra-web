import Box from '@mui/material/Box';
import TaskCard from '../task-card/TaskCard';

const TaskCardOverlay = ({ task }) => {
  return (
    <Box sx={{ cursor: 'grabbing', borderRadius: 4, boxShadow: (theme) => theme.vars.shadows[5] }}>
      <TaskCard task={task} />
    </Box>
  );
};

export default TaskCardOverlay;
