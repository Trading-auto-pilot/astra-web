import { useEffect, useState } from 'react';
import { Paper } from '@mui/material';
import EmailSidebar from 'layouts/email-layout/EmailSidebar';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import BulkSelectProvider from 'providers/BulkSelectProvider';
import { emailSidebarWidth, useEmailContext } from 'providers/EmailProvider';
import EmailListContainer from 'components/sections/email/email-list/EmailListContainer';

const Email = () => {
  const {
    emailState: { emails },
  } = useEmailContext();
  const { up } = useBreakpoints();
  const upMd = up('md');
  const [isDrawerOpen, setIsDrawerOpen] = useState(upMd);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  useEffect(() => {
    if (upMd) {
      setIsDrawerOpen(true);
    } else {
      setIsDrawerOpen(false);
    }
  }, [upMd]);

  return (
    <>
      <EmailSidebar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} up={upMd} />
      <Paper
        sx={(theme) => ({
          flex: 1,
          minWidth: 0,
          marginLeft: { md: `-${emailSidebarWidth}px` },
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
        <BulkSelectProvider data={emails}>
          <EmailListContainer toggleDrawer={toggleDrawer} />
        </BulkSelectProvider>
      </Paper>
    </>
  );
};

export default Email;
