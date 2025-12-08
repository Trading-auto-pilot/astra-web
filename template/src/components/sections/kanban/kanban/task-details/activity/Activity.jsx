import { Timeline, timelineItemClasses } from '@mui/lab';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useKanbanContext } from 'providers/KanbanProvider';
import ActivityItem from './ActivityItem';

const Activity = () => {
  const { taskDetails } = useKanbanContext();

  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Activity
      </Typography>
      {taskDetails?.activities && (
        <Timeline
          sx={{
            p: 0,
            m: 0,
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {taskDetails.activities.map((activity, index) => (
            <Box
              key={activity.id}
              sx={{ pb: (taskDetails.activities?.length ?? 0 - 1 !== index) ? 2 : 0 }}
            >
              <Typography variant="subtitle1" sx={{ pb: 2, fontWeight: 600 }}>
                {activity.date}
              </Typography>
              {activity.items.map((item, index) => {
                return (
                  <ActivityItem
                    key={item.id}
                    data={item}
                    isLastItem={index === activity.items.length - 1}
                  />
                );
              })}
            </Box>
          ))}
        </Timeline>
      )}
    </Paper>
  );
};

export default Activity;
