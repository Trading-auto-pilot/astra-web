import { useState } from 'react';
import { Button, Menu, MenuItem, listClasses, menuClasses } from '@mui/material';
import EllipsisHorizontalIcon from 'components/icons/EllipsisHorizontalIcon';

const defaultItems = [
  {
    label: 'Sync',
  },
  {
    label: 'Export',
  },
  {
    label: 'Remove',
    sx: { color: 'error.main' },
  },
];

const CoverImageMenu = ({
  menuItems = defaultItems,
  icon = <EllipsisHorizontalIcon />,
  size = 'small',
  variant = 'text',
  handleRemoveFile,
  sx,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    if (
      typeof event === 'object' &&
      event !== null &&
      'stopPropagation' in event &&
      typeof event.stopPropagation === 'function'
    ) {
      event.stopPropagation();
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        sx={{ color: 'text.primary', ...sx }}
        shape="square"
        color="neutral"
        size={size}
        variant={variant}
        aria-label="more"
        id="action-button"
        aria-controls={open ? 'actions-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        {icon}
      </Button>

      <Menu
        id="actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          [`& .${menuClasses.paper}`]: {
            [`& .${listClasses.root}`]: {
              minWidth: 120,
            },
          },
        }}
        slotProps={{
          list: {
            'aria-labelledby': 'action-button',
          },
        }}
      >
        {menuItems.map(({ label, onClick, ...rest }) => (
          <MenuItem
            key={label}
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) {
                onClick(e);
              }
              if (label === 'Remove') {
                handleRemoveFile();
              }
              handleClose(e);
            }}
            {...rest}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default CoverImageMenu;
