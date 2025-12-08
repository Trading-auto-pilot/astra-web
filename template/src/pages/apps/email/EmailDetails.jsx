import { useEffect, useState } from 'react';
import { Box, Paper } from '@mui/material';
import EmailSidebar from 'layouts/email-layout/EmailSidebar';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import BulkSelectProvider from 'providers/BulkSelectProvider';
import { emailSidebarWidth, useEmailContext } from 'providers/EmailProvider';
import Resizable from 'components/base/Resizable';
import EmailDetailsContainer from 'components/sections/email/email-details/EmailDetailsContainer';
import EmailListContainer from 'components/sections/email/email-list/EmailListContainer';

const EmailDetails = () => {
  const {
    emailState: { emails },
    handleResize,
  } = useEmailContext();
  const { up } = useBreakpoints();
  const upXl = up('xl');
  const [isDrawerOpen, setIsDrawerOpen] = useState(upXl);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  useEffect(() => {
    if (upXl) {
      setIsDrawerOpen(true);
    } else {
      setIsDrawerOpen(false);
    }
  }, [upXl]);

  return (
    <>
      <EmailSidebar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} up={upXl} />
      <Box
        sx={(theme) => ({
          flex: 1,
          minWidth: 0,
          display: 'flex',
          marginLeft: { xl: `-${emailSidebarWidth}px` },
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(isDrawerOpen && {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
          }),
        })}
      >
        <Resizable
          handleResize={handleResize}
          sx={{
            display: { xs: 'none', lg: 'block' },
            ['.resizable-handler']: {
              width: '8px !important',
              borderLeft: '1px solid',
              borderColor: 'divider',
            },
          }}
          defaultSize={{ width: '43%' }}
          maxWidth="calc(100% - 375px)"
        >
          <Paper sx={{ height: 1 }}>
            <BulkSelectProvider data={emails}>
              <EmailListContainer toggleDrawer={toggleDrawer} />
            </BulkSelectProvider>
          </Paper>
        </Resizable>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <EmailDetailsContainer />
        </Box>
      </Box>
    </>
  );
};

export default EmailDetails;
