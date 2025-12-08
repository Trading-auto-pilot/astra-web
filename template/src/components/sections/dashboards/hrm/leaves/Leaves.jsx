import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import SectionHeader from 'components/common/SectionHeader';
import LeaveCard from './LeaveCard';

const Leaves = ({ leaves }) => {
  return (
    <Paper
      component={Stack}
      direction="column"
      background={1}
      sx={{ p: { xs: 3, md: 5 }, height: 1 }}
    >
      <SectionHeader
        title="Leaves Left"
        subTitle=""
        actionComponent={
          <Stack sx={{ gap: 1, alignItems: 'center' }}>
            <Button>History</Button>
            <Button variant="contained">Apply</Button>
          </Stack>
        }
      />
      <Grid container spacing={1} size={12}>
        {leaves.map((leave) => (
          <Grid size={{ xs: 6, sm: 3, md: 6, lg: 3 }} key={leave.title}>
            <LeaveCard leaveData={leave} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default Leaves;
