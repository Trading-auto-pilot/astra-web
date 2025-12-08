import { useState } from 'react';
import { Outlet } from 'react-router';
import { Paper, Stack } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useFileManager } from 'providers/FileManagerProvider';
import FileManagerHeader from './FileManagerHeader';
import FileInfoDrawer from './file-info/FileInfoDrawer';

const MainContent = () => {
  const { handleDrawer: handleSidebar } = useFileManager();
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const { up } = useBreakpoints();

  const upXl = up('xl');

  return (
    <Stack sx={{ flex: 1, height: 1, position: 'relative' }}>
      <Paper
        component={Stack}
        direction="column"
        sx={[
          {
            flex: 1,
            height: 1,
            position: 'relative',
          },
          upXl && {
            transition: (theme) =>
              theme.transitions.create('margin', {
                easing: isInfoDrawerOpen
                  ? theme.transitions.easing.easeOut
                  : theme.transitions.easing.sharp,
                duration:
                  theme.transitions.duration[isInfoDrawerOpen ? 'enteringScreen' : 'leavingScreen'],
              }),
            marginRight: isInfoDrawerOpen ? 0 : '-405px',
          },
        ]}
      >
        <FileManagerHeader
          handleSidebar={handleSidebar}
          handleToggleInfo={() => setIsInfoDrawerOpen(!isInfoDrawerOpen)}
        />

        <Stack direction="column" sx={{ height: 1, flex: 1 }}>
          <Outlet />
        </Stack>
      </Paper>

      <FileInfoDrawer
        isOpen={isInfoDrawerOpen}
        toggleDrawer={() => setIsInfoDrawerOpen(!isInfoDrawerOpen)}
      />
    </Stack>
  );
};

export default MainContent;
