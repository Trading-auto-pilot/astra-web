import Grid from '@mui/material/Grid';
import JobOpeningCard from './JobOpeningCard';

const JobBoard = ({ jobs, sx }) => {
  return (
    <Grid container rowSpacing={2} columnSpacing={2} sx={{ ...sx }}>
      {jobs.map((job) => (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={job.id}>
          <JobOpeningCard job={job} />
        </Grid>
      ))}
    </Grid>
  );
};

export default JobBoard;
