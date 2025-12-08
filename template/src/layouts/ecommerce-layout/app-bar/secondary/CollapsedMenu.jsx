import { useState } from 'react';
import { Button, ListItemText, Menu, MenuItem } from '@mui/material';
import { kebabCase } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';

const CollapsedMenu = ({ links }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        color="neutral"
        variant="text"
        size="small"
        sx={{
          whiteSpace: 'nowrap',
          flexShrink: 0,
          px: 1,
        }}
        endIcon={<IconifyIcon icon="material-symbols:expand-more-rounded" sx={{ fontSize: 22 }} />}
        onClick={handleClick}
      >
        More
      </Button>
      <Menu
        anchorEl={anchorEl}
        id="collapsed-links"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 132,
            },
          },
        }}
      >
        {links.map((link) => (
          <MenuItem key={kebabCase(link.label)}>
            <ListItemText primary={link.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default CollapsedMenu;
