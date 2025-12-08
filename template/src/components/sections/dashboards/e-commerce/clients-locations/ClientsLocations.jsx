import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { clientLocations } from 'data/e-commerce/dashboard';
import DashboardSelectMenu from 'components/common/DashboardSelectMenu';
import SectionHeader from 'components/common/SectionHeader';
import LocationChart from './LocationChart';
import LocationMap from './LocationMap';

const ClientsLocations = () => {
  return (
    <Paper
      sx={{ p: { xs: 3, md: 5 }, height: '100%', display: 'flex', flexDirection: 'column' }}
      background={1}
    >
      <SectionHeader
        title="Most clients"
        subTitle="Our client number based on their primary location"
        actionComponent={<DashboardSelectMenu defaultValue={1} />}
      />
      <Grid container spacing={3}>
        <Grid
          size={{
            xs: 12,
            md: 6,
            xl: 12,
          }}
        >
          <LocationMap
            data={clientLocations}
            sx={{
              width: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              height: { md: '260px !important', xl: '450px !important' },
            }}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 6,
            xl: 12,
          }}
        >
          <LocationChart
            data={clientLocations}
            sx={{
              height: { md: '260px !important' },
              width: '100%',
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ClientsLocations;
