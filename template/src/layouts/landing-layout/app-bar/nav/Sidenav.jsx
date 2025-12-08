import { useState } from 'react';
import { IconButton, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import IconifyIcon from 'components/base/IconifyIcon';
import Logo from 'components/common/Logo';
import NavItem from './NavItem';
import PromoCard from './PromoCard';

const Sidenav = ({ menus }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setIsOpen(newOpen);
  };

  const menuItems = menus.find((item) => item.label === 'Pages');

  const DrawerList = (
    <Stack direction="column" sx={{ gap: 3, width: 320, py: 3, px: 2 }} role="presentation">
      <Stack sx={{ px: 2, justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo />

        <IconButton aria-label="close" onClick={toggleDrawer(false)}>
          <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>

      <List disablePadding>
        {menuItems.submenus.map((menu) => (
          <NavItem key={menu.label} menu={menu} disabledSecondaryText />
        ))}
      </List>

      <PromoCard />
    </Stack>
  );

  return (
    <div>
      <Button shape="square" color="neutral" variant="soft" onClick={toggleDrawer(true)}>
        <IconifyIcon icon="material-symbols:menu-rounded" fontSize={20} />
      </Button>

      <Drawer open={isOpen} anchor="right" onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default Sidenav;
