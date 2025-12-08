import { useState } from 'react';
import Button from '@mui/material/Button';
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon';
import Menu, { menuClasses } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';

export const menuItems = [
  {
    icon: 'material-symbols:edit-outline-rounded',
    text: 'Rename section',
  },
  {
    icon: 'material-symbols:content-copy-outline-rounded',
    text: 'Copy list',
  },
  {
    icon: 'material-symbols:delete-outline-rounded',
    text: 'Delete this list',
  },
];

const ListMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    }
    handleClose();
  };

  return (
    <>
      <Button
        id="list-container-menu"
        aria-controls={open ? 'list-container-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        variant="text"
        color="neutral"
        size="small"
        shape="square"
        onClick={handleOpen}
        onPointerDown={(e) => e.stopPropagation()}
        sx={{ ml: 'auto' }}
      >
        <IconifyIcon
          icon="material-symbols:more-vert"
          sx={{ fontSize: 18, pointerEvents: 'none' }}
        />
      </Button>
      <Menu
        id="container-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'container-menu',
          },
        }}
        sx={{
          [`& .${menuClasses.paper}`]: {
            minWidth: 180,
          },
        }}
      >
        {menuItems.map((item) => (
          <MenuItem key={item.text} onClick={() => handleItemClick(item)}>
            <ListItemIcon
              sx={{ [`&.${listItemIconClasses.root}`]: { minWidth: 'unset !important' } }}
            >
              <IconifyIcon
                icon={item.icon}
                sx={{ color: 'text.secondary', fontSize: '16px !important' }}
              />
            </ListItemIcon>
            <Typography variant="body2" sx={{ ml: 1 }}>
              {item.text}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ListMenu;
