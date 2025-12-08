import { useRef } from 'react';
import { Paper, Stack, Typography, boxClasses } from '@mui/material';
import { acquisitionCostData } from 'data/crm/dashboard';
import useToggleChartLegends from 'hooks/useToggleChartLegends';
import ChartLegend from 'components/common/ChartLegend';
import DashboardMenu from 'components/common/DashboardMenu';
import AcquisitionCostChart from './AcquisitionCostChart';

const chartLegends = [
  { label: 'Allotted', color: 'chBlue.300' },
  { label: 'Used', color: 'chGrey.300' },
];

const AcquisitionCost = () => {
  const chartRef = useRef(null);
  const { legendState, handleLegendToggle } = useToggleChartLegends(chartRef);

  return (
    <Paper sx={{ height: 1, p: { xs: 3, md: 5 } }}>
      <Stack
        sx={{
          columnGap: { xs: 5, lg: 3 },
          rowGap: 2,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Typography variant="h6" mb={1}>
            Customer Acquisition Cost
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            CAC present vs last week
          </Typography>
        </div>

        <Stack
          sx={{
            flex: 1,
            flexBasis: { xs: '100%', sm: 0 },
            order: { xs: 1, sm: 0 },
            alignSelf: 'flex-start',
            gap: 2,
            my: 1.25,
          }}
        >
          {chartLegends.map((legend) => (
            <ChartLegend
              key={legend.label}
              label={legend.label}
              color={legend.color}
              isActive={legendState[legend.label]}
              handleClick={() => handleLegendToggle(legend.label)}
              sx={{
                [`& .${boxClasses.root}`]: {
                  borderRadius: 0.5,
                  height: 8,
                },
              }}
            />
          ))}
        </Stack>
        <DashboardMenu />
      </Stack>

      <AcquisitionCostChart
        data={acquisitionCostData}
        sx={{ height: '230px !important' }}
        ref={chartRef}
      />
    </Paper>
  );
};

export default AcquisitionCost;
