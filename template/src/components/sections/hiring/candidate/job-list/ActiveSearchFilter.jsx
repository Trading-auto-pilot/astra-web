import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useHiringContext } from 'providers/HiringProvider';

const ActiveSearchFilter = ({ search }) => {
  const {
    candidate: { jobs },
  } = useHiringContext();

  const jobsCount = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.name.toLowerCase().includes(search.toLowerCase()) ||
      job.overview.location.toLowerCase().includes(search.toLowerCase()),
  ).length;

  return (
    <Stack justifyContent="space-between">
      <Stack gap={1.5}>
        <Typography variant="subtitle1" fontWeight={700}>
          Searched for
        </Typography>
        <Typography variant="subtitle1" fontWeight={500}>
          '{search}'
        </Typography>
      </Stack>
      <Stack gap={1.5}>
        <Typography variant="subtitle1" fontWeight={700}>
          {jobsCount}
        </Typography>
        <Typography variant="subtitle1" fontWeight={500}>
          {jobsCount === 1 ? 'Job' : 'Jobs'} Matched
        </Typography>
      </Stack>
    </Stack>
  );
};

export default ActiveSearchFilter;
