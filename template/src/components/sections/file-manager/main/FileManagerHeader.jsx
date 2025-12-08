import { Box, Button, InputAdornment, Paper, Stack } from '@mui/material';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useFileManager } from 'providers/FileManagerProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import FileSelectionBar from './FileSelectionBar';
import CreateNew from './create-new/CreateNew';
import FilterFiles from './filter-files/FilterFiles';
import UploadFiles from './upload-files/UploadFiles';

const FileManagerHeader = ({ handleSidebar, handleToggleInfo }) => {
  const { topbarHeight } = useNavContext();
  const { allFiles } = useFileManager();
  const { up } = useBreakpoints();
  const upMd = up('md');

  return (
    <Box sx={{ position: 'sticky', top: topbarHeight, zIndex: 10 }}>
      <Paper
        component={Stack}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          px: { xs: 3, md: 5 },
          py: 2,
          gap: 1,
          justifyContent: 'space-between',
          alignItems: { sm: 'center' },
        }}
      >
        <Stack gap={1} sx={{ flexShrink: 0 }}>
          {!upMd && (
            <Button
              variant="soft"
              shape="square"
              color="neutral"
              onClick={() => handleSidebar(true)}
            >
              <IconifyIcon icon="material-symbols:filter-list-rounded" fontSize={20} />
            </Button>
          )}
          <CreateNew />
          <UploadFiles />
        </Stack>

        <Stack gap={1}>
          <StyledTextField
            placeholder="Search by name"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconifyIcon icon="material-symbols:search-rounded" />
                  </InputAdornment>
                ),
              },
            }}
            fullWidth
            sx={{
              flex: 1,
              maxWidth: { sm: 320 },
            }}
          />

          <FilterFiles />
        </Stack>
      </Paper>

      {allFiles.length > 0 && <FileSelectionBar handleToggleInfo={handleToggleInfo} />}
    </Box>
  );
};

export default FileManagerHeader;
