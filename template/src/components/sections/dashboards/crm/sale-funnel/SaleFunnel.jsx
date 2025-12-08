import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { saleFunnelData, saleFunnelTableData } from 'data/crm/dashboard';
import DashboardMenu from 'components/common/DashboardMenu';
import SectionHeader from 'components/common/SectionHeader';
import SaleFunnelChart from './SaleFunnelChart';
import SaleFunnelTable from './SaleFunnelTable';

const SaleFunnel = () => {
  return (
    <Paper background={1} sx={{ height: 1, p: { xs: 3, md: 5 } }}>
      <SectionHeader
        title="Sale Funnel"
        subTitle="Amount of revenue in one month"
        actionComponent={<DashboardMenu />}
        sx={{ mb: 3 }}
      />
      <Grid container spacing={{ xs: 4, sm: 3, md: 4 }}>
        <Grid size={{ xs: 12, sm: 5, md: 6, xl: 12 }}>
          <SaleFunnelChart data={saleFunnelData} sx={{ width: 1, height: '254px !important' }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 7, md: 6, xl: 12 }}>
          <SaleFunnelTable data={saleFunnelTableData} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SaleFunnel;
