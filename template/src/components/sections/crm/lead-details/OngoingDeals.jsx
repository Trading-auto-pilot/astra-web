import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import DashboardMenu from 'components/common/DashboardMenu';
import Deal from './Deal';

const OngoingDeals = ({ ongoingDeals }) => {
  return (
    <Paper sx={{ px: { xs: 3, md: 5 }, py: 5, flex: 1, height: 1 }}>
      <Stack sx={{ mb: 4, justifyContent: 'space-between' }}>
        <Typography variant="h6">Ongoing Deals</Typography>
        <Stack gap={1}>
          <Button
            variant="contained"
            href={paths.addContact}
            startIcon={<IconifyIcon icon="material-symbols:add" />}
          >
            New Deal
          </Button>
          <DashboardMenu size="medium" />
        </Stack>
      </Stack>
      <Stack direction="column" gap={1}>
        {ongoingDeals.map((deal) => (
          <Deal key={deal.id} deal={deal} />
        ))}
      </Stack>
    </Paper>
  );
};

export default OngoingDeals;
