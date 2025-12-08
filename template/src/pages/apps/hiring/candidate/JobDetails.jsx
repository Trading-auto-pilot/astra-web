import { useEffect } from 'react';
import { useParams } from 'react-router';
import Grid from '@mui/material/Grid';
import { useHiringContext } from 'providers/HiringProvider';
import JobDetailsAside from 'components/sections/hiring/candidate/job-details/aside';
import JobDetailsMain from 'components/sections/hiring/candidate/job-details/main';

const JobDetails = () => {
  const { id } = useParams();
  const {
    job,
    setJob,
    candidate: { jobs },
  } = useHiringContext();

  const foundJob = jobs.find((job) => job.id === Number(id)) || jobs[2];

  useEffect(() => {
    setJob(foundJob);
  }, [id]);

  if (!job) return null;

  return (
    <Grid container height={1}>
      <Grid
        size={{
          xs: 12,
          md: 8,
          xl: 9,
        }}
      >
        <JobDetailsMain job={job} />
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 4,
          xl: 3,
        }}
      >
        <JobDetailsAside job={job} />
      </Grid>
    </Grid>
  );
};

export default JobDetails;
