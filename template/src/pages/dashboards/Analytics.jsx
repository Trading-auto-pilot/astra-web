import Grid from '@mui/material/Grid';
import {
  analyticKPIs,
  sessionByOSChartData,
  topCampaignsChartData,
  userByCohortData,
  userByCountryData,
  userByOSData,
  userEngagementChartData,
  userLocations,
} from 'data/analytics/dashboard';
import ProPlanCTA from 'components/sections/dashboards/analytics/cta/ProPlanCTA';
import AnalyticKPI from 'components/sections/dashboards/analytics/kpi/AnalyticKPI';
import RealtimeEngagement from 'components/sections/dashboards/analytics/realtime-engagement/RealtimeEngagement';
import SessionByOS from 'components/sections/dashboards/analytics/session-by-os/SessionByOS';
import TopCampaigns from 'components/sections/dashboards/analytics/top-campaigns/TopCampaigns';
import UserByCohort from 'components/sections/dashboards/analytics/user-by-cohort/UserByCohort';
import UserByCountry from 'components/sections/dashboards/analytics/user-by-country/UserByCountry';
import UserByOS from 'components/sections/dashboards/analytics/user-by-os/UserByOS';
import UserEngagement from 'components/sections/dashboards/analytics/user-engagement/UserEngagement';

const Analytics = () => {
  return (
    <Grid container>
      <Grid size={{ xs: 12, xl: 5 }} container>
        {analyticKPIs.map((kpi) => (
          <Grid key={kpi.title} size={{ xs: 6, md: 3, xl: 6 }}>
            <AnalyticKPI kpi={kpi} />
          </Grid>
        ))}
      </Grid>

      <Grid size={{ xs: 12, lg: 7 }}>
        <UserEngagement data={userEngagementChartData} />
      </Grid>

      <Grid size={{ xs: 12, lg: 5 }}>
        <TopCampaigns data={topCampaignsChartData} />
      </Grid>

      <Grid container size={{ xs: 12, xl: 7 }}>
        <Grid size={12}>
          <ProPlanCTA />
        </Grid>

        <Grid size={12}>
          <UserByCountry data={userByCountryData} />
        </Grid>
      </Grid>

      <Grid container size={{ xs: 12, xl: 5 }}>
        <Grid size={{ xs: 12, md: 6, xl: 12 }}>
          <UserByOS data={userByOSData} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 12 }}>
          <SessionByOS data={sessionByOSChartData} />
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, xl: 7 }}>
        <UserByCohort data={userByCohortData} />
      </Grid>

      <Grid size={12}>
        <RealtimeEngagement data={userLocations} />
      </Grid>
    </Grid>
  );
};

export default Analytics;
