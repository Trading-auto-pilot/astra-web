import Stack from '@mui/material/Stack';
import JobCard from './JobCard';

const JobListView = ({ jobs }) => {
  return (
    <Stack direction="column" gap={1} mb={3}>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </Stack>
  );
};

export default JobListView;
