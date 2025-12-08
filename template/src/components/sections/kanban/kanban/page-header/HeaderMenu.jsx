import { useState } from 'react';
import Button, { buttonClasses } from '@mui/material/Button';
import Menu, { menuClasses } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { boards, kanbanBoard } from 'data/kanban/kanban';
import IconifyIcon from 'components/base/IconifyIcon';

const HeaderMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(kanbanBoard.name);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (item) => {
    setSelectedBoard(item);
    handleClose();
  };

  return (
    <>
      <Button
        id="kanban-board-menu"
        aria-controls={open ? 'kanban-board-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        variant="text"
        color="neutral"
        size="large"
        sx={{
          px: { xs: 0, sm: 1 },
          whiteSpace: 'nowrap',
          fontWeight: { xs: 600, md: 400 },
          fontSize: { xs: 'body2.fontSize', md: 'h6.fontSize' },
          '&:hover': { bgcolor: 'transparent !important' },
          [`& .${buttonClasses.startIcon}`]: {
            mr: { xs: 0.5, md: 1 },
          },
          [`& .${buttonClasses.endIcon}`]: {
            ml: { xs: 0.5, md: 1 },
          },
        }}
        disableElevation
        disableRipple
        onClick={handleOpen}
        startIcon={
          <IconifyIcon icon="material-symbols:lock-outline" sx={{ fontSize: '18px !important' }} />
        }
        endIcon={
          <IconifyIcon
            icon="material-symbols:expand-more-rounded"
            sx={{ fontSize: { xs: '21px !important', md: '24px !important' } }}
          />
        }
      >
        {selectedBoard}
      </Button>
      <Menu
        id="board-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        slotProps={{
          list: {
            'aria-labelledby': 'board-menu',
          },
        }}
        sx={{
          [`& .${menuClasses.paper}`]: {
            minWidth: 220,
          },
        }}
      >
        {boards.map((item) => (
          <MenuItem
            key={item}
            selected={item === selectedBoard}
            sx={{ textTransform: 'capitalize' }}
            onClick={() => handleClick(item)}
            disableRipple
          >
            {item}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default HeaderMenu;
