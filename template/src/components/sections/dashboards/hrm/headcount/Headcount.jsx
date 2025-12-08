import { useEffect, useRef, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import useToggleChartLegends from 'hooks/useToggleChartLegends';
import DashboardMenu from 'components/common/DashboardMenu';
import SectionHeader from 'components/common/SectionHeader';
import HeadcountChart from './HeadcountChart';

const chartLegends = [
  {
    label: 'Involuntary',
    color: 'chBlue.200',
  },
  {
    label: 'Voluntary',
    color: 'chBlue.100',
  },
  {
    label: 'Other',
    color: 'chGrey.200',
  },
];

const Headcount = ({ headcounts }) => {
  const [value, setValue] = useState(headcounts[0].name);
  const chartRef = useRef(null);
  const { legendState, handleLegendToggle } = useToggleChartLegends(chartRef);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chartRef.current) {
        const chart = chartRef.current.getEchartsInstance();
        chart.resize();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Paper
      background={1}
      component={Stack}
      direction="column"
      sx={{ p: { xs: 3, md: 5 }, height: 1 }}
    >
      <SectionHeader
        title="Headcount Matrics"
        subTitle="Key summaries  of no. of employees"
        actionComponent={<DashboardMenu />}
      />

      <Stack direction="column" sx={{ flex: 1 }}>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
            aria-label="headcount-tabs"
          >
            {headcounts.map((item) => (
              <Tab key={item.name} label={item.name} value={item.name} />
            ))}
          </TabList>

          <Stack
            sx={{
              mb: 2,
              gap: 2,
              alignItems: 'center',
              justifyContent: { xl: 'flex-end' },
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
              Reasons:
            </Typography>
            <Stack sx={{ gap: 2, alignItems: 'center' }}>
              {chartLegends.map(({ label, color }) => (
                <ButtonBase
                  key={label}
                  disableRipple
                  onClick={() => handleLegendToggle(label)}
                  sx={{
                    gap: 0.75,
                    alignItems: 'center',
                    opacity: legendState[label] ? 0.5 : 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      bgcolor: color,
                      borderRadius: 1,
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    sx={{
                      textOverflow: 'ellipsis',
                      fontWeight: 500,
                      maxWidth: 1,
                    }}
                  >
                    {label}
                  </Typography>
                </ButtonBase>
              ))}
            </Stack>
          </Stack>

          {headcounts.map((item, index) => (
            <TabPanel key={item.name} value={item.name} sx={{ p: 0, height: 1 }}>
              <HeadcountChart
                key={item.name}
                ref={chartRef}
                data={headcounts[index].records}
                sx={{ height: '100% !important', minHeight: { xs: 300, md: 1 }, width: 1 }}
              />
            </TabPanel>
          ))}
        </TabContext>
      </Stack>
    </Paper>
  );
};

export default Headcount;
