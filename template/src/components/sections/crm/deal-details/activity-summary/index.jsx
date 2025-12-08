import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import ActivityTimeline from './ActivityTimeline';
import Summary from './Summary';

const ActivitySummary = ({ activitySummary }) => {
  const { summary, timeline } = activitySummary;

  return (
    <Paper component={Stack} direction="column" sx={{ p: { xs: 3, md: 5 }, gap: 3 }}>
      <Stack sx={{ justifyContent: 'space-between' }}>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          Activity Summary
        </Typography>
        <Button
          variant="soft"
          color="neutral"
          size="small"
          startIcon={<IconifyIcon icon="material-symbols:edit-outline-rounded" />}
        >
          Modify
        </Button>
      </Stack>

      <Stack direction="column" gap={3}>
        <Summary summary={summary} />
        <ActivityTimeline timeline={timeline} />
      </Stack>
    </Paper>
  );
};

export default ActivitySummary;
