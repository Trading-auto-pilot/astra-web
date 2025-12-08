import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import useNumberFormat from 'hooks/useNumberFormat';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import CompanyInfo from './CompanyInfo';
import OverviewItem from './OverviewItem';

const JobDetailsAside = ({ job }) => {
  const { currencyFormat } = useNumberFormat();
  const { topbarHeight } = useNavContext();

  return (
    <Paper background={1} sx={{ height: 1 }}>
      <Box sx={() => ({ position: 'sticky', top: topbarHeight, p: { xs: 3, md: 5 } })}>
        <Stack direction="column" gap={3}>
          <Typography variant="h6" lineHeight={1.5}>
            Job Overview
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
              <OverviewItem
                icon="material-symbols:business-center-outline-rounded"
                label="Employement Type"
                value={job.overview.employmentType}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
              <OverviewItem
                icon="material-symbols:work-outline"
                label="Work Mode"
                value={job.overview.workMode}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
              <OverviewItem
                icon="material-symbols:payments-outline"
                label="Offered Salary"
                value={currencyFormat(job.overview.offeredSalary, { maximumFractionDigits: 0 })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
              <OverviewItem
                icon="material-symbols:badge-outline"
                label="Experience"
                value={`${job.overview.experience} years`}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
              <OverviewItem
                icon="material-symbols:schedule-outline"
                label="Deadline"
                value={dayjs(job.overview.deadline).format('MMM DD, YYYY')}
              />
            </Grid>
          </Grid>
          <Divider />
          <Stack direction="column" gap={2}>
            <CompanyInfo company={job.company} />
            <Button variant="soft" sx={{ alignSelf: 'flex-start' }}>
              View Profile
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default JobDetailsAside;
