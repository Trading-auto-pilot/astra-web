import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Billable from './Billable';
import ProjectSelect from './ProjectSelect';
import Timer from './Timer';

const PageHeader = () => {
  return (
    <Paper
      component={Stack}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ gap: { xs: 1.75, md: 10 }, px: { xs: 3, md: 5 }, py: 2.5 }}
    >
      <ProjectSelect />
      <Stack
        sx={{
          ml: 'auto',
          gap: 4,
          width: { xs: 1, md: 'auto' },
          justifyContent: { xs: 'space-between', md: 'flex-end' },
        }}
      >
        <Billable />
        <Timer />
      </Stack>
    </Paper>
  );
};

export default PageHeader;
