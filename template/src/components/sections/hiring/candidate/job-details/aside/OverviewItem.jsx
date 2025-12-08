import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';

const OverviewItem = ({ icon, label, value }) => {
  return (
    <Stack direction="column" gap={1}>
      <Stack gap={1} alignItems="center">
        <IconifyIcon icon={icon} sx={{ fontSize: 24 }} />
        <Typography variant="subtitle1" fontWeight={600}>
          {label}
        </Typography>
      </Stack>
      <Typography color="text.secondary">{value}</Typography>
    </Stack>
  );
};

export default OverviewItem;
