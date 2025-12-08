import { useState } from 'react';
import Button, { buttonClasses } from '@mui/material/Button';
import Menu, { menuClasses } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';

const menuItems = [
  {
    label: 'Last Edited',
  },
  {
    label: 'Recently Added',
  },
  {
    label: 'Date Created',
  },
  {
    label: 'Alphabetical (A-Z)',
  },
];

const SortMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(menuItems[0]);
  const open = Boolean(anchorEl);
  const { up } = useBreakpoints();
  const upLg = up('lg');

  const handleMenuItemClick = (item) => {
    setSelectedMenu(item);
    if (item.onClick) {
      item.onClick();
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Sort by" disableHoverListener={upLg ? true : false}>
        <Button
          id="kanban-sort-menu"
          aria-controls={open ? 'kanban-sort-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          shape={upLg ? undefined : 'square'}
          aria-haspopup="true"
          variant="text"
          color="neutral"
          disableElevation
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={[
            { flexShrink: 0 },
            !upLg && {
              [`& .${buttonClasses.startIcon}`]: {
                m: 0,
              },
            },
          ]}
          startIcon={
            <IconifyIcon
              icon="material-symbols:sort-rounded"
              sx={{ fontSize: '20px !important' }}
            />
          }
          endIcon={
            upLg && (
              <IconifyIcon
                icon="material-symbols:expand-more-rounded"
                sx={{ fontSize: '20px !important' }}
              />
            )
          }
        >
          {upLg && selectedMenu.label}
        </Button>
      </Tooltip>
      <Menu
        id="sort-menu"
        slotProps={{
          list: {
            'aria-labelledby': 'sort-menu',
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        sx={{
          [`& .${menuClasses.paper}`]: {
            minWidth: 160,
          },
        }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            sx={{ fontSize: 'body2.fontSize', textTransform: 'capitalize' }}
            onClick={() => handleMenuItemClick(item)}
            selected={selectedMenu.label === item.label}
            disableRipple
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default SortMenu;
