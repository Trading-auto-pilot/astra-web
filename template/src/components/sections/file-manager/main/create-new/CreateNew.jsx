import { useState } from 'react';
import { ListItemText, Typography } from '@mui/material';
import { Button, ListItemIcon, Menu, MenuItem } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const menuItems = [
  {
    icon: 'material-symbols:create-new-folder-outline-rounded',
    label: 'New folder',
    shortcut: '⌘ F',
  },
  {
    icon: 'material-symbols:upload-file-outline-rounded',
    label: 'File upload',
    shortcut: '⌘ U',
  },
  {
    icon: 'material-symbols:drive-folder-upload-outline-rounded',
    label: 'Folder upload',
    shortcut: '⌘ I',
  },
  {
    icon: 'material-symbols:note-add-outline-rounded',
    label: 'Documents',
    subItems: [
      { icon: 'material-symbols:docs-outline-rounded', label: 'Docs' },
      { icon: 'material-symbols:forms-add-on-rounded', label: 'Forms' },
      { icon: 'material-symbols:note-add-outline-rounded', label: 'Word' },
      { icon: 'material-symbols:picture-as-pdf-outline-rounded', label: 'PDF' },
    ],
  },
  {
    icon: 'material-symbols:post-add-rounded',
    label: 'Presentation',
    subItems: [
      { icon: 'material-symbols:lab-profile-outline-rounded', label: 'Sheets' },
      { icon: 'material-symbols:co-present-outline-rounded', label: 'Powerpoint' },
    ],
  },
];

const SubMenu = ({ open, anchorEl, onClose, items, onItemClick }) => (
  <Menu
    open={open}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    sx={{
      pointerEvents: 'none',
      '& .MuiPaper-root': {
        pointerEvents: 'auto',
        width: 200,
      },
    }}
    slotProps={{
      paper: {
        onMouseLeave: onClose,
      },
    }}
  >
    {items.map((item, index) => (
      <MenuItem key={index} onClick={onItemClick}>
        <ListItemIcon>
          <IconifyIcon icon={item.icon} />
        </ListItemIcon>
        <ListItemText>{item.label}</ListItemText>
      </MenuItem>
    ))}
  </Menu>
);

const MenuItemComponent = ({
  item,
  onItemClick,
  onMouseEnter,
  onMouseLeave,
  subMenuOpen,
  subMenuAnchor,
}) => (
  <MenuItem
    onClick={item.subItems ? undefined : onItemClick}
    onMouseEnter={item.subItems ? onMouseEnter : undefined}
    onMouseLeave={item.subItems ? onMouseLeave : undefined}
    sx={{
      py: 1,
    }}
  >
    <ListItemIcon>
      <IconifyIcon icon={item.icon} />
    </ListItemIcon>
    <ListItemText>{item.label}</ListItemText>
    {item.shortcut && (
      <Typography variant="caption" color="text.secondary">
        {item.shortcut}
      </Typography>
    )}
    {item.subItems && (
      <>
        <IconifyIcon icon="material-symbols:chevron-right-rounded" />
        <SubMenu
          items={item.subItems}
          open={subMenuOpen}
          anchorEl={subMenuAnchor}
          onClose={onMouseLeave}
          onItemClick={onItemClick}
        />
      </>
    )}
  </MenuItem>
);

const CreateNew = () => {
  const [mainMenuAnchor, setMainMenuAnchor] = useState(null);
  const [subMenuAnchor, setSubMenuAnchor] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const handleMainMenuClick = (event) => {
    setMainMenuAnchor(event.currentTarget);
  };

  const handleMainMenuClose = () => {
    setMainMenuAnchor(null);
    setOpenSubMenu(null);
    setSubMenuAnchor(null);
  };

  const handleSubMenuOpen = (event, label) => {
    setOpenSubMenu(label);
    setSubMenuAnchor(event.currentTarget);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}
        sx={{ flexShrink: 0 }}
        onClick={handleMainMenuClick}
      >
        Create New
      </Button>

      <Menu
        anchorEl={mainMenuAnchor}
        open={Boolean(mainMenuAnchor)}
        onClose={handleMainMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              width: 200,
            },
          },
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItemComponent
            key={index}
            item={item}
            onItemClick={handleMainMenuClose}
            onMouseEnter={(e) => handleSubMenuOpen(e, item.label)}
            onMouseLeave={() => setOpenSubMenu(null)}
            subMenuOpen={openSubMenu === item.label}
            subMenuAnchor={subMenuAnchor}
          />
        ))}
      </Menu>
    </>
  );
};

export default CreateNew;
