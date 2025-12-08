import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { statData } from 'data/hiring/dashboard';
import dayjs from 'dayjs';
import SectionWrapper from '../common/SectionWrapper';
import StatCard from './StatCard';

const OverviewStats = () => {
  const today = dayjs();

  return (
    <SectionWrapper>
      <Stack sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h5" sx={{ mb: 0.5, whiteSpace: 'nowrap' }}>
            Welcome, John Carter!
          </Typography>
          <Typography variant="subtitle1" component="p" fontWeight={500} color="text.secondary">
            Have a Productive Day!
          </Typography>
        </div>

        <Box sx={{ textAlign: 'right' }}>
          <Typography
            variant="subtitle2"
            component="p"
            color="text.secondary"
            sx={{ mb: 1, whiteSpace: 'nowrap' }}
          >
            Today is {today.format('dddd')}
          </Typography>
          <Typography variant="subtitle1" component="p" fontWeight={600}>
            {today.format('DD MMMM, YYYY')}
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={{ xs: 2, lg: 1, xl: 2 }}>
        {statData.map((stat) => (
          <Grid key={stat.title} size={{ xs: 6, sm: 4 }}>
            <StatCard
              title={stat.title}
              subTitle={stat.subTitle}
              value={stat.value}
              icon={stat.icon}
            />
          </Grid>
        ))}
      </Grid>
    </SectionWrapper>
  );
};

export default OverviewStats;
