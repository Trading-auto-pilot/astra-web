import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Menu, { menuClasses } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconifyIcon from 'components/base/IconifyIcon';

const FilterMenu = ({ label, field, handleFilter, menuItems }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (filterBy) => {
    if (handleFilter) {
      handleFilter(field, filterBy);
    }
    handleMenuClose();
  };

  return (
    <div>
      <Button
        id={`${field}-filter-button`}
        aria-controls={open ? `${field}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="text"
        color="neutral"
        fullWidth
        sx={{ whiteSpace: 'nowrap', p: 1 }}
        disableElevation
        onClick={handleMenuOpen}
        endIcon={
          <IconifyIcon icon="material-symbols:expand-more-rounded" fontSize="20px !important" />
        }
      >
        {label}
      </Button>
      <Menu
        id={`${field}-menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{ [`& .${menuClasses.paper}`]: { minWidth: 140, maxHeight: 400 } }}
        slotProps={{
          list: {
            'aria-labelledby': `${field}-filter-button`,
          },
        }}
      >
        {field !== 'timeframe' && (
          <MenuItem disableRipple onClick={() => handleMenuItemClick('')}>
            All
          </MenuItem>
        )}
        {menuItems.map((item, index) => {
          const itemLabel = typeof item === 'string' ? item : item.name;

          return (
            <MenuItem
              key={index}
              sx={{ textTransform: 'capitalize' }}
              onClick={() => handleMenuItemClick(itemLabel)}
              disableRipple
            >
              {typeof item !== 'string' && item.avatar && (
                <ListItemAvatar sx={{ minWidth: 'unset', mr: 1 }}>
                  <Avatar src={item.avatar} alt={item.name} sx={{ height: 24, width: 24 }} />
                </ListItemAvatar>
              )}
              <ListItemText primary={itemLabel} />
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default FilterMenu;
