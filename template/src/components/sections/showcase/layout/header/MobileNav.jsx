import { useState } from 'react';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { navItems } from 'data/showcase';
import IconifyIcon from 'components/base/IconifyIcon';
import Logo from 'components/common/Logo';
import NeutralButton from '../../common/NeutralButton';

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 352, p: 1 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {navItems.map((nav) => (
          <ListItem key={nav.label} disablePadding>
            <ListItemButton href={nav.href}>
              <ListItemText primary={nav.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <NeutralButton
        onClick={toggleDrawer(true)}
        shape="square"
        sx={{ color: 'common.white', opacity: 1, transform: 'translateY(2px)' }}
      >
        <IconifyIcon
          icon="material-symbols:menu-rounded"
          sx={{ fontSize: 20, color: 'common.white' }}
        />
      </NeutralButton>

      <Drawer data-aurora-color-scheme="dark" open={open} onClose={toggleDrawer(false)}>
        <Stack sx={{ p: 3, justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo
            sx={{
              '& + p': {
                background: 'none !important',
                WebkitTextFillColor: ({ vars }) => `${vars.palette.common.white} !important`,
              },
            }}
          />

          <NeutralButton
            onClick={toggleDrawer(false)}
            shape="circle"
            sx={{ color: 'common.white', opacity: 1 }}
          >
            <IconifyIcon icon="material-symbols:close-rounded" sx={{ color: 'common.white' }} />
          </NeutralButton>
        </Stack>

        {DrawerList}
      </Drawer>
    </div>
  );
};

export default MobileNav;
