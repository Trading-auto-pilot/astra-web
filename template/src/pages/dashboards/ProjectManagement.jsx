import Grid from '@mui/material/Grid';
import {
  deadlineMetrics,
  events,
  projectHours,
  projectTimelineData,
  projectsInfos,
  taskMetrics,
  upcomingMeetings,
} from 'data/project/dashboard';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import Events from 'components/sections/dashboards/project/events/Events';
import HoursCompleted from 'components/sections/dashboards/project/hours-completed/HoursCompleted';
import ProductRoadmap from 'components/sections/dashboards/project/product-roadmap/ProductRoadmap';
import ProjectDeadlines from 'components/sections/dashboards/project/project-deadlines/ProjectDeadlines';
import ProjectTimeline from 'components/sections/dashboards/project/project-timeline/ProjectTimeline';
import ScheduleMeeting from 'components/sections/dashboards/project/schedule-meeting/ScheduleMeeting';
import TaskSummary from 'components/sections/dashboards/project/task-summary/TaskSummary';

const ProjectManagement = () => {
  const { up } = useBreakpoints();
  const upXl = up('xl');

  return (
    <Grid container>
      <Grid container size={12}>
        {!upXl && (
          <Grid size={12}>
            <TaskSummary taskMetrics={taskMetrics} />
          </Grid>
        )}

        <Grid container size={{ xs: 12, lg: 7, xl: 9 }}>
          {upXl && (
            <Grid size={12}>
              <TaskSummary taskMetrics={taskMetrics} />
            </Grid>
          )}
          <Grid size={12}>
            <ProjectTimeline projectTimelineData={projectTimelineData} />
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 5, xl: 3 }}>
          <ProjectDeadlines deadlineMetrics={deadlineMetrics} />
        </Grid>

        <Grid size={{ xs: 12, lg: 7, xl: 9 }} order={{ sm: 1, lg: 0 }}>
          <ProductRoadmap projectInfos={projectsInfos} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 5, xl: 3 }}>
          <ScheduleMeeting upcomingMeetings={upcomingMeetings} />
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, xl: 7 }}>
        <Events events={events} />
      </Grid>

      <Grid size={{ xs: 12, xl: 5 }}>
        <HoursCompleted projectHours={projectHours} />
      </Grid>
    </Grid>
  );
};

export default ProjectManagement;
