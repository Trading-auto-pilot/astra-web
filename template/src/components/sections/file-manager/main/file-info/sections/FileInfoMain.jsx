import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import emptyFileDark from 'assets/images/illustrations/11-dark.webp';
import emptyFile from 'assets/images/illustrations/11.webp';
import multifileDark from 'assets/images/illustrations/13-dark.webp';
import multifile from 'assets/images/illustrations/13.webp';
import { useFileManager } from 'providers/FileManagerProvider';
import Image from 'components/base/Image';
import FileAccessList from './FileAccessList';
import FileActivity from './FileActivity';
import FileInfoMedia from './FileInfoMedia';
import FileProperties from './FileProperties';

const FileInfoMain = () => {
  const { selectedFiles } = useFileManager();

  return (
    <Stack direction="column" sx={{ height: 1 }}>
      {selectedFiles.length === 0 && (
        <Paper background={1} sx={{ p: { xs: 3, md: 5 }, height: 1 }}>
          <Stack
            direction="column"
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Image
              src={{ light: emptyFile, dark: emptyFileDark }}
              sx={{ height: 1, objectFit: 'contain' }}
            />
          </Stack>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, textAlign: 'center', color: 'text.secondary' }}
          >
            Select an item to view more information
          </Typography>
        </Paper>
      )}
      {selectedFiles.length === 1 && (
        <>
          <FileInfoMedia file={selectedFiles[0]} />
          <FileProperties file={selectedFiles[0]} />
          <FileAccessList file={selectedFiles[0]} />
          <FileActivity file={selectedFiles[0]} />
        </>
      )}
      {selectedFiles.length > 1 && (
        <Paper background={1} sx={{ p: { xs: 3, md: 5 }, height: 1 }}>
          <Stack direction="column" sx={{ justifyContent: 'center', alignItems: 'center', mb: 3 }}>
            <Image
              src={{ light: multifile, dark: multifileDark }}
              sx={{ height: 1, objectFit: 'contain' }}
            />
          </Stack>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, textAlign: 'center', color: 'text.secondary' }}
          >
            {selectedFiles.length} Items Selected
          </Typography>
        </Paper>
      )}
    </Stack>
  );
};

export default FileInfoMain;
