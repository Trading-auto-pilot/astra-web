import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { useFaqContext } from 'providers/FaqProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import FaqSidenav from './faq-sidenav/FaqSidenav';

const FaqDrawer = () => {
  const { drawerOpen, handleDrawerClose } = useFaqContext();

  return (
    <Drawer
      open={drawerOpen}
      onClose={handleDrawerClose}
      sx={(theme) => ({
        [`& .${drawerClasses.paper}`]: {
          px: 2,
          width: 350,
          background: `${theme.vars.palette.background.elevation1} !important`,
        },
        display: { xs: 'block', md: 'none' },
      })}
    >
      <Stack sx={{ pl: 2, pr: 1.25, py: 3, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Categories</Typography>
        <Button variant="text" color="neutral" shape="square" onClick={handleDrawerClose}>
          <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 20 }} />
        </Button>
      </Stack>
      <FaqSidenav />
    </Drawer>
  );
};

export default FaqDrawer;
