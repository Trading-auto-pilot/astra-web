import { Paper } from '@mui/material';
import { avgLifetimeValueData } from 'data/crm/dashboard';
import DashboardMenu from 'components/common/DashboardMenu';
import SectionHeader from 'components/common/SectionHeader';
import AvgLifetimeValueChart from './AvgLifetimeValueChart';

const AvgLifetimeValue = () => {
  return (
    <Paper background={1} sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
      <SectionHeader
        title="Avg. Life Time Value"
        subTitle="CAC and LTV last year"
        actionComponent={<DashboardMenu />}
        sx={{ px: { xs: 3, md: 5 }, pt: { xs: 3, md: 5 } }}
      />

      <AvgLifetimeValueChart
        data={avgLifetimeValueData}
        sx={{
          flex: 1,
          minHeight: 420,
        }}
      />
    </Paper>
  );
};

export default AvgLifetimeValue;
