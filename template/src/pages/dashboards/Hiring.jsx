import Grid from '@mui/material/Grid';
import CandidateSources from 'components/sections/dashboards/hiring/candidate-sources';
import Candidates from 'components/sections/dashboards/hiring/candidates';
import Meetings from 'components/sections/dashboards/hiring/meetings';
import MyPositions from 'components/sections/dashboards/hiring/my-positions';
import NewHires from 'components/sections/dashboards/hiring/new-hires';
import OverviewStats from 'components/sections/dashboards/hiring/overview-stats';
import Pipeline from 'components/sections/dashboards/hiring/pipeline';

const Hiring = () => {
  return (
    <Grid container>
      <Grid size={12} container>
        <Grid size={{ xs: 12, xl: 8 }}>
          <OverviewStats />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <CandidateSources />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <MyPositions />
        </Grid>

        <Grid container size={{ xs: 12, xl: 8 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NewHires />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Meetings />
          </Grid>

          <Grid size={12}>
            <Candidates />
          </Grid>
        </Grid>
      </Grid>

      <Grid size={12}>
        <Pipeline />
      </Grid>
    </Grid>
  );
};

export default Hiring;
