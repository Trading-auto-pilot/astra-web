import { Link, Stack, Tooltip, Typography } from '@mui/material';
import { cssVarRgba, getFileIcon } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';

const FileMessage = ({ messageType, files, sx }) => {
  return (
    <Stack direction="column" gap={0.5}>
      {files.map((file) => (
        <Stack
          key={file.name}
          component={Link}
          href="#!"
          underline="none"
          sx={{
            alignItems: 'center',
            alignSelf: messageType === 'sent' ? 'flex-end' : 'flex-start',
            gap: 2,
            borderRadius: 4,
            p: (theme) => theme.spacing(1, 3, 1, 1),
            width: 208,
            bgcolor: 'background.elevation2',
            ...sx,
          }}
        >
          <Stack
            sx={{
              flexShrink: 0,
              height: 54,
              width: 54,
              borderRadius: 4,
              p: 1,
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) => cssVarRgba(theme.vars.palette.common.whiteChannel, 0.36),
            }}
          >
            <IconifyIcon
              icon={getFileIcon(file.format)}
              sx={{ fontSize: 24, color: 'text.primary' }}
            />
          </Stack>

          <Tooltip title={file.name} placement="bottom">
            <Typography
              variant="subtitle2"
              sx={{
                lineClamp: 2,
                overflow: 'hidden',
                wordBreak: 'break-all',
                color: 'text.secondary',
              }}
            >
              {file.name.length > 20 ? `${file.name.substring(0, 20)}...${file.format}` : file.name}
            </Typography>
          </Tooltip>
        </Stack>
      ))}
    </Stack>
  );
};

export default FileMessage;
