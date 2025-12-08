import { useState } from 'react';
import { Button, ListItemText, Menu, MenuItem, listClasses } from '@mui/material';
import { kebabCase } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';

const searchCategories = ['All', 'Popular', 'New', 'Discounted', 'Top Rated', 'Featured'];

const SearchMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(searchCategories[0]);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button color="neutral" variant="text" onClick={handleClick} sx={{ flexShrink: 0 }}>
        {selectedCategory}
        <IconifyIcon icon="material-symbols:expand-more-rounded" sx={{ fontSize: 22, ml: 1 }} />
      </Button>
      <Menu
        anchorEl={anchorEl}
        id="language-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            minWidth: 160,
          },
        }}
      >
        {searchCategories.map((category) => (
          <MenuItem
            key={kebabCase(category)}
            onClick={() => {
              setSelectedCategory(category);
            }}
          >
            <ListItemText primary={category} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default SearchMenu;
