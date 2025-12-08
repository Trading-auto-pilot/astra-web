import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AudioPlayer from 'components/base/AudioPlayer';
import IconifyIcon from 'components/base/IconifyIcon';

const CallDetails = ({ call }) => {
  return (
    <>
      <Divider sx={{ borderColor: 'dividerLight', mb: 2, opacity: 0.59 }} />
      <Stack direction="column" gap={1} sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700 }}>
          Audio Record
        </Typography>
        <AudioPlayer src={call.audioSrc} />
      </Stack>
      {call.transcript.length > 0 && (
        <>
          <Divider sx={{ borderColor: 'dividerLight', mb: 2, opacity: 0.59 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, mb: 1 }}>
              Transcript
            </Typography>
            {call.transcript.map((script) => (
              <Stack
                key={script.id}
                gap={1}
                sx={{
                  px: 1,
                  py: 1.25,
                  borderRadius: 1,
                  '&:nth-of-type(2n)': {
                    backgroundColor: 'background.elevation2',
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 48 }}>
                  {script.user}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  :
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {script.message}
                </Typography>
              </Stack>
            ))}
          </Box>
        </>
      )}
      <Divider sx={{ borderColor: 'dividerLight', mb: 2, opacity: 0.59 }} />
      <Stack direction="column" sx={{ mb: 2, alignItems: 'flex-start' }}>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, mb: 1 }}>
          Note
        </Typography>
        <Button
          size="small"
          startIcon={
            <IconifyIcon icon="material-symbols:edit-note" sx={{ fontSize: '18px !important' }} />
          }
        >
          Add Note
        </Button>
      </Stack>
    </>
  );
};

export default CallDetails;
