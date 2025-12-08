import { useRef } from 'react';
import { Box, ButtonBase, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { leadSoursesData } from 'data/crm/dashboard';
import useToggleChartLegends from 'hooks/useToggleChartLegends';
import DashboardMenu from 'components/common/DashboardMenu';
import SectionHeader from 'components/common/SectionHeader';
import LeadSourcesChart from './LeadSourcesChart';

const chartLegends = [
  { label: 'Organic', color: 'chBlue.400' },
  { label: 'Marketing', color: 'chOrange.400' },
  { label: 'Social media', color: 'chLightBlue.300' },
  { label: 'Blog posts', color: 'chGreen.400' },
];

const LeadSources = () => {
  const chartRef = useRef(null);
  const { legendState, handleLegendToggle } = useToggleChartLegends(chartRef);

  return (
    <Paper sx={{ height: 1, p: { xs: 3, md: 5 } }}>
      <Stack direction="column" height={1}>
        <SectionHeader
          title="Lead Sources"
          subTitle="Ratio of generated leads"
          actionComponent={<DashboardMenu />}
          sx={{ mb: 0, flex: 1 }}
        />

        <Stack direction="column">
          <Box sx={{ position: 'relative' }}>
            <LeadSourcesChart
              data={leadSoursesData}
              ref={chartRef}
              sx={{ height: '215px !important' }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Typography variant="h4">
                {leadSoursesData.reduce((acc, item) => acc + item.value, 0)}
              </Typography>
            </Box>
          </Box>

          <Grid
            container
            spacing={{ xs: 1, sm: 3, md: 1, lg: 3 }}
            sx={{
              alignItems: 'center',
            }}
          >
            {chartLegends.map(({ label, color }) => (
              <Grid key={label} size={{ xs: 3, sm: 6, md: 3 }}>
                <ButtonBase
                  disableRipple
                  onClick={() => handleLegendToggle(label)}
                  sx={{
                    width: 1,
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    opacity: legendState[label] ? 0.5 : 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    noWrap
                    color="text.secondary"
                    sx={{
                      textOverflow: 'ellipsis',
                      maxWidth: 1,
                      mb: 1,
                    }}
                  >
                    {label}
                  </Typography>
                  <Box sx={{ width: 1, height: 8, bgcolor: color, borderRadius: 0.5 }} />
                </ButtonBase>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default LeadSources;
