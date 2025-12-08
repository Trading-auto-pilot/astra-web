import { Drawer, drawerClasses } from '@mui/material';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import SimpleBar from 'components/base/SimpleBar';
import FileInfo from './FileInfo';

const FileInfoDrawer = ({ isOpen = false, toggleDrawer }) => {
  const { topbarHeight } = useNavContext();
  const { up } = useBreakpoints();
  const upXl = up('xl');

  const drawerWidth = 405;

  return (
    <>
      {upXl ? (
        <Drawer
          variant="persistent"
          open={isOpen}
          anchor="right"
          slotProps={{
            paper: {
              background: 1,
            },
          }}
          sx={(theme) => ({
            flexShrink: 0,
            height: theme.mixins.contentHeight(topbarHeight),
            pointerEvents: 'none',
            maxWidth: drawerWidth,
            width: 1,
            position: 'sticky',
            top: topbarHeight,
            overflow: 'hidden',
            zIndex: 'unset',
            [`& .${drawerClasses.paper}`]: {
              pointerEvents: 'auto',
              boxSizing: 'border-box',
              position: 'unset',
              maxWidth: drawerWidth,
              width: 1,
              height: 1,
              overflow: 'hidden',
            },
          })}
        >
          <SimpleBar>
            <FileInfo toggleDrawer={toggleDrawer} />
          </SimpleBar>
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={isOpen}
          onClose={toggleDrawer}
          anchor="right"
          ModalProps={{
            keepMounted: true,
          }}
          slotProps={{
            paper: {
              background: 1,
            },
          }}
          sx={{
            [`& .${drawerClasses.paper}`]: {
              maxWidth: drawerWidth,
              width: 1,
            },
          }}
        >
          <SimpleBar>
            <FileInfo toggleDrawer={toggleDrawer} />
          </SimpleBar>
        </Drawer>
      )}
    </>
  );
};

export default FileInfoDrawer;
