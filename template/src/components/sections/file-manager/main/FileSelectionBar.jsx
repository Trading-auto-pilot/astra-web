import { Button, Paper, Stack, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useFileManager } from 'providers/FileManagerProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import FMDropdownMenu from '../common/FMDropdownMenu';

const FileSelectionBar = ({ handleToggleInfo }) => {
  const { topbarHeight } = useNavContext();
  const { up } = useBreakpoints();
  const { allFiles, selectedFiles, fileManagerDispatch, filter } = useFileManager();

  const upSm = up('sm');

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
    <Paper
      component={Stack}
      background={1}
      sx={{
        px: { xs: 3, md: 5 },
        py: 2,
        gap: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: topbarHeight,
      }}
    >
      <Stack gap={2}>
        <Stack gap={0.5} alignItems="center">
          {selectedFiles.length > 0 && (
            <Button
              variant="text"
              shape="circle"
              color="neutral"
              onClick={() => fileManagerDispatch({ type: 'DESELECT_ALL_FILES' })}
            >
              <IconifyIcon icon="material-symbols:close-rounded" fontSize={20} />
            </Button>
          )}
          <Typography variant="subtitle1" fontWeight={700}>
            {selectedFiles.length > 0
              ? `${selectedFiles.length === 1 ? '1 Item' : `${selectedFiles.length} Items`} selected`
              : `Total ${currentFiles.length} Items`}
          </Typography>
        </Stack>
        {selectedFiles.length > 0 && (
          <Stack gap={1} alignItems="center">
            {upSm && (
              <>
                <Tooltip title="Download">
                  <Button variant="soft" shape="square" color="neutral">
                    <IconifyIcon icon="material-symbols:download-rounded" fontSize={20} />
                  </Button>
                </Tooltip>
                <Tooltip title="Share">
                  <Button variant="soft" shape="square" color="neutral">
                    <IconifyIcon icon="material-symbols:share-outline" fontSize={20} />
                  </Button>
                </Tooltip>
                <Tooltip title="Delete">
                  <Button variant="soft" shape="square" color="neutral">
                    <IconifyIcon icon="material-symbols:delete-outline-rounded" fontSize={20} />
                  </Button>
                </Tooltip>
              </>
            )}
            <FMDropdownMenu size="medium" variant="soft" />
          </Stack>
        )}
      </Stack>

      <Tooltip title="View details">
        <Button variant="soft" shape="square" color="neutral" onClick={handleToggleInfo}>
          <IconifyIcon icon="material-symbols:info-outline-rounded" fontSize={20} />
        </Button>
      </Tooltip>
    </Paper>
  );
};

export default FileSelectionBar;
