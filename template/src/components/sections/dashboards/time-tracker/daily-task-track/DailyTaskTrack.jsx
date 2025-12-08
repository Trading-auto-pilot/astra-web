import { Paper } from '@mui/material';
import { projects, tasks, timeRanges } from 'data/time-tracker/dashboard';
import TaskTrackChart from './TaskTrackChart';
import TaskTrackHeader from './TaskTrackHeader';

const DailyTaskTrack = () => {
  return (
    <Paper sx={{ p: { xs: 3, md: 5 }, height: 1 }}>
      <TaskTrackHeader />
      <TaskTrackChart projects={projects} tasks={tasks} timeRanges={timeRanges} />
    </Paper>
  );
};

export default DailyTaskTrack;
