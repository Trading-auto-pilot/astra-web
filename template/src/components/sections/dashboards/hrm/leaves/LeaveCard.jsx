import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const LeaveCard = ({ leaveData }) => {
  return (
    <Stack
      direction="column"
      sx={{
        p: 2,
        height: { xs: 120, md: 142 },
        bgcolor: 'background.elevation2',
        borderRadius: 2,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          width: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'block',
        }}
      >
        {leaveData.title}
      </Typography>
      <Box sx={{ mt: 'auto' }}>
        <Stack
          direction={{ xs: 'row', md: 'column', xl: 'row' }}
          sx={{ mb: { xs: 0.5, md: 1, xl: 0.5 }, alignItems: 'baseline' }}
        >
          <Typography variant="h5" sx={{ mr: 0.5 }}>
            {leaveData.days}
          </Typography>
          <Typography variant="subtitle2">days</Typography>
        </Stack>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            display: 'block',
            width: 1,
          }}
        >{`${leaveData.remainingDays} days left`}</Typography>
      </Box>
    </Stack>
  );
};

export default LeaveCard;
