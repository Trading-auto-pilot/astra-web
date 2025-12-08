import { Drawer, Paper } from '@mui/material';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useFileManager } from 'providers/FileManagerProvider';
import SimpleBar from 'components/base/SimpleBar';
import DriveNavigation from './drive-navigation/DriveNavigation';
import StorageInfo from './storage-info/StorageInfo';

const FileSidebarContent = ({ handleDrawer }) => {
  return (
    <SimpleBar>
      <DriveNavigation handleDrawer={handleDrawer} />
      <StorageInfo />
    </SimpleBar>
  );
};

const FileManagerSidebar = () => {
  const { isSidebarOpen, handleDrawer } = useFileManager();
  const { topbarHeight } = useNavContext();
  const { up } = useBreakpoints();
  const upMd = up('md');

  return upMd ? (
    <Paper
      background={1}
      sx={(theme) => ({
        width: 270,
        height: { md: theme.mixins.contentHeight(topbarHeight).md },
        position: { md: 'sticky' },
        top: topbarHeight,
      })}
    >
      <FileSidebarContent handleDrawer={handleDrawer} />
    </Paper>
  ) : (
    <Drawer
      open={isSidebarOpen}
      anchor="left"
      onClose={() => handleDrawer(false)}
      slotProps={{
        paper: {
          background: 1,
          sx: { width: 270 },
        },
      }}
    >
      <FileSidebarContent handleDrawer={handleDrawer} />
    </Drawer>
  );
};

export default FileManagerSidebar;
