import { useState } from 'react';
import {
  Badge,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  badgeClasses,
  listClasses,
} from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useChatContext } from 'providers/ChatProvider';
import IconifyIcon from 'components/base/IconifyIcon';

const menuItems = ['all', 'unread', 'starred'];

const FilterMenu = ({ handleFilter }) => {
  const { conversations, filterBy } = useChatContext();
  const { only } = useBreakpoints();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const onlySm = only('sm');

  const handleFilterMenu = {
    set: (event) => setFilterAnchorEl(event.currentTarget),
    close: () => setFilterAnchorEl(null),
  };

  return (
    <>
      <Tooltip title="Filter conversations" placement={onlySm ? 'right' : 'top'}>
        <Badge
          badgeContent={`${conversations.length}`}
          color="primary"
          sx={{
            [`& .${badgeClasses.badge}`]: {
              top: 6,
              right: 2,
            },
          }}
        >
          <Button variant="soft" shape="circle" color="neutral" onClick={handleFilterMenu.set}>
            <IconifyIcon icon="material-symbols:filter-list-rounded" sx={{ fontSize: 18 }} />
          </Button>
        </Badge>
      </Tooltip>
      <Menu
        anchorEl={filterAnchorEl}
        open={!!filterAnchorEl}
        onClose={handleFilterMenu.close}
        anchorOrigin={{
          vertical: onlySm ? 'top' : 'bottom',
          horizontal: onlySm ? 'right' : 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          [`& .${listClasses.root}`]: {
            minWidth: 144,
          },
          ml: 1,
        }}
      >
        {menuItems.map((filter) => (
          <MenuItem
            selected={filterBy === filter}
            key={filter}
            onClick={() => {
              handleFilter(filter);
              handleFilterMenu.close();
            }}
          >
            <ListItemIcon>
              {filterBy === filter && <IconifyIcon icon="ic:round-check" />}
            </ListItemIcon>
            <ListItemText>{filter.charAt(0).toUpperCase() + filter.slice(1)}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default FilterMenu;
