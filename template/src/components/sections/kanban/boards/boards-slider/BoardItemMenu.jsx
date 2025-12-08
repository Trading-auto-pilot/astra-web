import { useState } from 'react';
import { Grow } from '@mui/material';
import Button from '@mui/material/Button';
import Menu, { menuClasses } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';

const menuItems = [
  {
    id: 1,
    label: 'Share',
  },
  {
    id: 2,
    label: 'Delete',
  },
];

const BoardItemMenu = ({ isHovered }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { up } = useBreakpoints();
  const upSm = up('sm');

  const isOpen = Boolean(anchorEl);

  const actionButton = (
    <Button
      variant="soft"
      color="neutral"
      shape="circle"
      id="board-item-menu"
      aria-controls={isOpen ? 'board-item-menu' : undefined}
      aria-expanded={isOpen ? 'true' : undefined}
      aria-haspopup="true"
      onClick={(e) => setAnchorEl(e.currentTarget)}
      sx={{ position: 'absolute', zIndex: 1, top: 16, right: 16 }}
    >
      <IconifyIcon
        icon="material-symbols:more-horiz"
        sx={{ fontSize: 20, pointerEvents: 'none' }}
      />
    </Button>
  );

  return (
    <>
      {upSm ? <Grow in={isHovered}>{actionButton}</Grow> : actionButton}
      <Menu
        id="board-item-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          list: {
            'aria-labelledby': 'board-item-menu',
          },
        }}
        sx={{
          [`& .${menuClasses.paper}`]: {
            minWidth: 120,
          },
        }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            sx={[{ textTransform: 'capitalize' }, item.id === 2 && { color: 'error.main' }]}
            disableRipple
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default BoardItemMenu;
