import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ActionBtns from './ActionBtns';
import DetailsSection from './DetailsSection';

const JobDetailsMain = ({ job }) => {
  return (
    <Paper sx={{ height: 1, p: { xs: 3, md: 5 } }}>
      <Container maxWidth="sm" disableGutters>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {job.title}
        </Typography>
        <Stack direction="column" gap={4} sx={{ mb: 4 }}>
          <DetailsSection title="About the Role" description={job.details.aboutRole} />
          <DetailsSection title="Responsibilities" description={job.details.responsibilities} />
          <DetailsSection title="Requirements" description={job.details.requirements} />
          <DetailsSection title="Bonus Points" description={job.details.bonusPoints} />
          <DetailsSection title="Benefits" description={job.details.benefits} />
        </Stack>
        <ActionBtns />
      </Container>
    </Paper>
  );
};

export default JobDetailsMain;
