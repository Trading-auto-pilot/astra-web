import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AnalyticsChart from './AnalyticsChart';
import AnalyticsDetails from './AnalyticsDetails';

const Analytics = ({ analyticsData }) => {
  return (
    <Paper component={Stack} direction="column" sx={{ height: 1, p: { xs: 3, md: 5 }, gap: 3 }}>
      <Stack sx={{ justifyContent: 'space-between' }}>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          Analytics
        </Typography>
      </Stack>
      <Stack direction="column" gap={2.5}>
        <AnalyticsChart
          data={analyticsData}
          sx={{ mx: 'auto', height: '144px !important', width: 224 }}
        />
        <AnalyticsDetails data={analyticsData} />
      </Stack>
    </Paper>
  );
};

export default Analytics;
