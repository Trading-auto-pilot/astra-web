import { useRef } from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import { crmGeneratedRevenueData } from 'data/crm/dashboard';
import useToggleChartLegends from 'hooks/useToggleChartLegends';
import ChartLegend from 'components/common/ChartLegend';
import DashboardMenu from 'components/common/DashboardMenu';
import CRMGeneratedRevenueChart from './CRMGeneratedRevenueChart';

const chartLegends = [
  { label: '25th', color: 'chGrey.200' },
  { label: '50th', color: 'chGreen.400' },
  { label: '75th', color: 'chBlue.500' },
];

const CRMGeneratedRevenue = () => {
  const chartRef = useRef(null);
  const { legendState, handleLegendToggle } = useToggleChartLegends(chartRef);

  return (
    <Paper sx={{ p: { xs: 3, md: 5 }, height: 1 }}>
      <Stack
        direction="column"
        sx={{
          rowGap: 4,
          height: 1,
        }}
      >
        <Stack
          sx={{
            columnGap: { xs: 5, lg: 2, xl: 5 },
            rowGap: 3,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Typography variant="h6" mb={1}>
              Revenue Generated
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Amount of revenue in this month
            </Typography>
          </div>

          <Stack
            sx={{
              flex: 1,
              flexBasis: { xs: '100%', sm: 0 },
              order: { xs: 1, sm: 0 },
              alignSelf: 'flex-end',
              gap: 2,
            }}
          >
            {chartLegends.map((legend) => (
              <ChartLegend
                key={legend.label}
                label={legend.label}
                color={legend.color}
                isActive={legendState[legend.label]}
                handleClick={() => handleLegendToggle(legend.label)}
              />
            ))}
          </Stack>

          <DashboardMenu />
        </Stack>

        <CRMGeneratedRevenueChart
          data={crmGeneratedRevenueData}
          sx={{ minHeight: { xs: 300, xl: 'unset' }, flex: 1 }}
          ref={chartRef}
        />
      </Stack>
    </Paper>
  );
};

export default CRMGeneratedRevenue;
