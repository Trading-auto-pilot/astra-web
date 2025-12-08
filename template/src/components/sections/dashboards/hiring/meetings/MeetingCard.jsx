import Chip, { chipClasses } from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';

const MeetingCard = ({ item }) => {
  return (
    <Paper
      background={1}
      sx={{
        p: 2,
        outline: 0,
        borderRadius: 4,
        '&:hover': { bgcolor: 'background.elevation2', cursor: 'pointer' },
      }}
    >
      <Stack
        gap={1}
        alignItems="center"
        divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'dividerLight' }} />}
      >
        <Stack direction="column" gap={0.5} sx={{ width: 1, maxWidth: 70 }}>
          <Typography variant="subtitle2" fontWeight={600} whiteSpace="nowrap">
            {item.time}
          </Typography>
          <Typography variant="caption" fontWeight={500} color="text.secondary" lineHeight={1.5}>
            {item.duration}
          </Typography>
        </Stack>

        <Stack gap={1} flexGrow={1} justifyContent="space-between">
          <Stack direction="column" gap={0.5}>
            <Typography variant="caption" fontWeight={500} color="text.secondary" lineHeight={1.5}>
              {item.type}
            </Typography>
            <Typography variant="subtitle2" fontWeight={600}>
              {item.title}
            </Typography>
          </Stack>

          <Chip
            icon={<IconifyIcon icon={item.chip.icon} sx={{ fontSize: 20 }} />}
            color={item.chip.color}
            clickable
            sx={{
              width: 20,
              height: 20,
              [`& .${chipClasses.label}`]: { display: 'none' },
            }}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default MeetingCard;
