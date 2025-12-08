import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconifyIcon from 'components/base/IconifyIcon';
import { getThumbnail } from 'components/sections/file-manager/common/helpers';

const FileInfoMedia = ({ file }) => {
  return (
    <Paper background={1} sx={{ p: { xs: 3, md: 5 } }}>
      <Stack
        component="figure"
        sx={{
          position: 'relative',
          m: 0,
          height: 200,
          borderRadius: 2,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          bgcolor: 'background.elevation2',
        }}
      >
        {file.extension ? (
          getThumbnail(file, 88, 'grey.500')
        ) : (
          <IconifyIcon
            icon="material-symbols:folder-outline-rounded"
            sx={{
              fontSize: 80,
              color: file.color || file.color !== '' ? file.color : 'grey.500',
            }}
          />
        )}
      </Stack>
    </Paper>
  );
};

export default FileInfoMedia;
