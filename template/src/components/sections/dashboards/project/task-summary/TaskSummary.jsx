import { Stack } from '@mui/material';
import TaskSummaryCard from './TaskSummaryCard';

const TaskSummary = ({ taskMetrics }) => {
  return (
    <Stack flex={1} direction={{ xs: 'column', sm: 'row' }}>
      {taskMetrics.map((task) => (
        <TaskSummaryCard key={task.title} task={task} />
      ))}
    </Stack>
  );
};

export default TaskSummary;
