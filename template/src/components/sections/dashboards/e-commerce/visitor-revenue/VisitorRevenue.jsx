import { Paper, Stack } from '@mui/material';
import { visitorRevenueChartData } from 'data/e-commerce/dashboard';
import DashboardMenu from 'components/common/DashboardMenu';
import SectionHeader from 'components/common/SectionHeader';
import EcomStatSection from 'components/sections/common/EcomStatSection';
import VisitorRevenueChart from './VisitorRevenueChart';

const VisitorRevenue = () => {
  return (
    <Paper sx={{ p: { xs: 3, md: 5 }, flex: 1, height: 1 }}>
      <Stack
        direction="column"
        sx={{
          rowGap: 2,
          height: 1,
          justifyContent: 'space-between',
        }}
      >
        <SectionHeader
          title="Visitor Value"
          subTitle="Avg. income per site visit"
          actionComponent={<DashboardMenu />}
          sx={{ mb: 0 }}
        />

        <EcomStatSection
          amount={63.02}
          increment={-1.03}
          chart={
            <VisitorRevenueChart
              data={visitorRevenueChartData}
              sx={{ height: '100% !important', width: 1, maxWidth: '45%', overflow: 'visible' }}
            />
          }
        />
      </Stack>
    </Paper>
  );
};

export default VisitorRevenue;
