import Grid from '@mui/material/Grid';
import { kpis, screencasts } from 'data/time-tracker/dashboard';
import DailyTaskTrack from 'components/sections/dashboards/time-tracker/daily-task-track/DailyTaskTrack';
import KPI from 'components/sections/dashboards/time-tracker/kpi/KPI';
import PageHeader from 'components/sections/dashboards/time-tracker/page-header/PageHeader';
import Screencasts from 'components/sections/dashboards/time-tracker/screencasts/Screencasts';
import Timesheet from 'components/sections/dashboards/time-tracker/timesheet/Timesheet';

const TimeTracker = () => {
  return (
    <Grid container>
      <Grid size={12}>
        <PageHeader />
      </Grid>

      <Grid container size={{ xs: 12, lg: 4, xl: 3 }}>
        {kpis.map((item) => (
          <Grid key={item.title} size={{ xs: 12, sm: 6, lg: 12 }}>
            <KPI data={item} />
          </Grid>
        ))}
      </Grid>

      <Grid container size={{ xs: 12, lg: 8, xl: 9 }}>
        <Grid size={12}>
          <Screencasts screencasts={screencasts} />
        </Grid>
        <Grid size={12}>
          <Timesheet />
        </Grid>
      </Grid>

      <Grid size={12}>
        <DailyTaskTrack />
      </Grid>
    </Grid>
  );
};

export default TimeTracker;
