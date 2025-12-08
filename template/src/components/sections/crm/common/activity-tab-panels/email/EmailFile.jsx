import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

const EmailFile = ({ file }) => {
  return (
    <Stack key={file.file.name} gap={2} sx={{ alignItems: 'center', px: 0.75, py: 0.5 }}>
      <Stack gap={2} sx={{ alignItems: 'center' }}>
        {file.type === 'image' && (
          <Box sx={{ borderRadius: 2, overflow: 'hidden', width: 56, height: 56 }}>
            <Image
              src={file.file.src}
              sx={{ objectFit: 'fill', height: 1, width: 1, borderRadius: 2 }}
            />
          </Box>
        )}
        {file.type === 'file' && (
          <Stack
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'background.elevation2',
              width: 56,
              height: 56,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconifyIcon
              icon="material-symbols-light:file-present-outline-rounded"
              sx={{ fontSize: 20 }}
            />
          </Stack>
        )}
        <Stack direction="column" gap={0.5}>
          <Typography variant="body2">{file.file.name}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {file.file.size}
          </Typography>
        </Stack>
      </Stack>
      <IconButton size="small" color="default">
        <IconifyIcon icon="material-symbols:close" sx={{ fontSize: 18 }} />
      </IconButton>
    </Stack>
  );
};

export default EmailFile;
