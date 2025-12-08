import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useHiringContext } from 'providers/HiringProvider';
import JobOpeningHeader from 'components/sections/hiring/admin/job-opening/Header';
import JobBoard from 'components/sections/hiring/admin/job-opening/JobBoard';
import JobPagination from 'components/sections/hiring/common/JobPagination';

const JobOpening = () => {
  const {
    admin: { jobOpenings },
  } = useHiringContext();

  return (
    <Stack component={Paper} direction="column" height={1}>
      <JobOpeningHeader />
      <Box sx={{ px: { xs: 3, md: 5 }, pb: { xs: 3, md: 5 }, pt: 3, flex: 1 }}>
        <JobBoard jobs={jobOpenings} sx={{ mb: 4 }} />
        <JobPagination jobs={jobOpenings.length} />
      </Box>
    </Stack>
  );
};

export default JobOpening;
