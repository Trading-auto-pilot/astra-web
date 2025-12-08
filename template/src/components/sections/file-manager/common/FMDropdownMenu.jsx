import { useState } from 'react';
import { Button, Menu, MenuItem, listClasses, menuClasses, useTheme } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import EllipsisHorizontalIcon from 'components/icons/EllipsisHorizontalIcon';

const defaultItems = [
  {
    id: 'file-info',
    label: 'File info',
    icon: 'material-symbols:info-outline-rounded',
  },
  {
    id: 'share',
    label: 'Share',
    icon: 'material-symbols:share-outline',
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: 'material-symbols:edit-outline-rounded',
  },
  {
    id: 'download',
    label: 'Download',
    icon: 'material-symbols:download-rounded',
  },
  {
    id: 'rename',
    label: 'Rename',
    icon: 'material-symbols:edit-note-outline-rounded',
  },
  {
    id: 'view-source',
    label: 'View Source',
    icon: 'material-symbols:topic-outline-rounded',
  },
  {
    id: 'copy-file',
    label: 'Copy File',
    icon: 'material-symbols:file-copy-outline-rounded',
  },
  {
    id: 'move-file',
    label: 'Move File',
    icon: 'material-symbols:exit-to-app-rounded',
  },
  {
    id: 'make-favorite',
    label: 'Make Favorite',
    icon: 'material-symbols:star-rate-rounded',
  },
  {
    id: 'delete-file',
    label: 'Delete File',
    icon: 'material-symbols:delete-outline-rounded',
    sx: { color: 'error.main' },
  },
];

const FMDropdownMenu = ({
  menuItems = defaultItems,
  icon = <EllipsisHorizontalIcon />,
  size = 'small',
  color = 'neutral',
  variant = 'text',
  sx,
  onMenuToggle,
}) => {
  const { direction } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    onMenuToggle?.(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    onMenuToggle?.(false);
  };

  return (
    <>
      <Button
        sx={{ color: 'text.primary', ...sx }}
        shape="square"
        color={color}
        size={size}
        variant={variant}
        aria-label="more"
        id="action-button"
        disableElevation={false}
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
          horizontal: direction === 'rtl' ? 'left' : 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: direction === 'rtl' ? 'left' : 'right',
        }}
        sx={{
          [`& .${menuClasses.paper}`]: {
            [`& .${listClasses.root}`]: {
              minWidth: 200,
            },
          },
        }}
        slotProps={{
          list: {
            'aria-labelledby': 'action-button',
          },
        }}
      >
        {menuItems.map(({ id, label, icon, onClick, sx, ...rest }) => (
          <MenuItem
            key={id}
            onClick={(e) => {
              if (onClick) {
                onClick(e);
              }
              e.stopPropagation();
              handleClose();
            }}
            sx={{ gap: 1, ...sx }}
            {...rest}
          >
            <IconifyIcon icon={icon} sx={{ fontSize: 16 }} />
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default FMDropdownMenu;
