import { useRef } from 'react';
import { Paper, Stack } from '@mui/material';
import { customerFeedbackData } from 'data/crm/dashboard';
import useToggleChartLegends from 'hooks/useToggleChartLegends';
import ChartLegend from 'components/common/ChartLegend';
import DashboardMenu from 'components/common/DashboardMenu';
import SectionHeader from 'components/common/SectionHeader';
import CustomerFeedbackChart from './CustomerFeedbackChart';

const chartLegends = [
  { label: 'Positive', color: 'chBlue.200' },
  { label: 'Negative', color: 'chGrey.200' },
  { label: '75th Percentile', color: 'chBlue.500' },
];

const CustomerFeedback = () => {
  const chartRef = useRef(null);
  const { legendState, handleLegendToggle } = useToggleChartLegends(chartRef);

  return (
    <Paper sx={{ p: { xs: 3, md: 5 }, height: 1 }}>
      <SectionHeader
        title="Customer Feedback"
        subTitle="Number of clients with response"
        actionComponent={<DashboardMenu />}
        sx={{ mb: 3 }}
      />

      <CustomerFeedbackChart
        data={customerFeedbackData}
        sx={{
          height: { xs: '215px !important', sm: '250px !important', md: '215px !important' },
          mb: 1,
        }}
        ref={chartRef}
      />

      <Stack
        sx={{
          gap: 2,
          flexWrap: 'wrap',
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
    </Paper>
  );
};

export default CustomerFeedback;
