import { useRef, useState } from 'react';
import { Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { months } from 'data/common/months';
import useToggleChartLegends from 'hooks/useToggleChartLegends';
import SectionHeader from 'components/common/SectionHeader';
import StyledTextField from 'components/styled/StyledTextField';
import AllocationChart from './AllocationChart';
import AllocationTable from './AllocationTable';
import ChartLegend from './ChartLegend';

const chartLegends = [
  { label: 'Tangible Assets', color: 'chBlue.200' },
  { label: 'Gross Salary', color: 'chGreen.200' },
  { label: 'Direct Revenue', color: 'chOrange.200' },
];

const Allocation = ({ allocation }) => {
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const chartRef = useRef(null);
  const { legendState, handleLegendToggle } = useToggleChartLegends(chartRef);

  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      <SectionHeader
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 3, sm: 2 }}
        title="Allocation per Dept"
        subTitle="Inter-department comparisons"
        sx={{ mb: { xs: 5, sm: 4 } }}
        actionComponent={
          <StyledTextField
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            sx={{ width: 1, maxWidth: 132 }}
            select
          >
            {months.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </StyledTextField>
        }
      />

      <Box
        sx={{
          display: 'grid',
          gap: 5,
          overflow: 'hidden',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 240px',
            lg: '1fr',
            xl: '1fr 240px',
          },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="column" sx={{ gap: 3 }}>
            <Stack sx={{ gap: 2, alignItems: 'center' }}>
              {chartLegends.map(({ label, color }) => (
                <ChartLegend
                  key={label}
                  state={legendState}
                  label={label}
                  color={color}
                  onToggle={handleLegendToggle}
                />
              ))}
            </Stack>

            <Box sx={{ minWidth: 0 }}>
              <AllocationChart ref={chartRef} data={allocation} />
            </Box>
          </Stack>
        </Box>

        <Box sx={{ width: 1, minWidth: 0 }}>
          <AllocationTable tableData={allocation.workforce} />
        </Box>
      </Box>
    </Paper>
  );
};

export default Allocation;
