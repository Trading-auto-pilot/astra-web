import { useLocation, useNavigate } from 'react-router';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { files } from 'data/file-manager';
import dayjs from 'dayjs';
import { useFileManager } from 'providers/FileManagerProvider';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import FilterAndSort from './FilterAndSort';
import NoFilesFound from './NoFilesFound';
import GridView from './grid-view';
import ListView from './list-view';

const AllFiles = () => {
  const { viewMode, allFiles, selectedFiles, filter } = useFileManager();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentFolder = files.find((folder) => folder.id.toString() === pathname.split('/').pop());

  const currentFiles = allFiles.filter((file) => {
    switch (filter) {
      case 'all':
        return file;
      case 'recent':
        return dayjs().diff(dayjs(file.uploadedAt), 'hour') <= 1;
      case 'folder':
        return file.type === 'folder';
      case 'favorite':
        return file.favorite;
      case 'shared':
        return file.shared.length > 0;
    }
  });

  return (
    <Paper sx={{ height: 1, p: { xs: 3, md: 5 }, flexGrow: 1 }}>
      <Container maxWidth={false} sx={{ maxWidth: 1, height: 1, p: '0 !important' }}>
        {!(pathname === paths.fileManager || pathname === paths.fileManager + '/') ? (
          <Breadcrumbs
            separator={<IconifyIcon icon="material-symbols:navigate-next" sx={{ fontSize: 20 }} />}
            sx={{ mb: 2 }}
          >
            <Typography
              component={Link}
              onClick={() => navigate(-1)}
              variant="h5"
              sx={{ fontSize: { xs: 20, md: 24 } }}
            >
              All Files
            </Typography>
            <Typography variant="h5" sx={{ fontSize: { xs: 20, md: 24 } }}>
              {currentFolder?.name}
            </Typography>
          </Breadcrumbs>
        ) : (
          <Typography variant="h5" sx={{ mb: 2, fontSize: { xs: 20, md: 24 } }}>
            All Files
          </Typography>
        )}

        {allFiles.length > 0 && <FilterAndSort />}
        {currentFiles.length === 0 && <NoFilesFound />}

        {viewMode === 'grid' && currentFiles.length > 0 && <GridView allFiles={currentFiles} />}
        {viewMode === 'list' && currentFiles.length > 0 && (
          <ListView allFiles={currentFiles} selectedFiles={selectedFiles} />
        )}
      </Container>
    </Paper>
  );
};

export default AllFiles;
