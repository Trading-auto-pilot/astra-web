import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';

const Summary = ({ summary }) => {
  return (
    <Stack
      direction="column"
      gap={3}
      sx={{ p: 2, borderRadius: 2, bgcolor: 'background.elevation1' }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Summary
      </Typography>
      <Stack gap={1} justifyContent="space-between">
        {summary.map((item) => (
          <Stack key={item.id} gap={0.5} sx={{ alignItems: 'center' }}>
            <Stack
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.lighter',
              }}
            >
              <IconifyIcon icon={item.icon} sx={{ fontSize: 16, color: 'primary.dark' }} />
            </Stack>
            <Typography variant="body2" sx={{ textWrap: 'nowrap' }}>
              {item.attribute}:{' '}
              <Typography component="span" sx={{ fontWeight: 700 }}>
                {item.value}
              </Typography>
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default Summary;
