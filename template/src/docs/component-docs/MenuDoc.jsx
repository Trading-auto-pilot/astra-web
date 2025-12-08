import { Link, Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicMenuCode = `const BasicMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Dashboard
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
render(<BasicMenu />)`;

const iconMenuCode = `const IconMenu = () => {
  return (
    <Paper sx={{ width: 1, maxWidth: 320 }}>
      <MenuList>
        <MenuItem>
          <ListItemIcon>
            <IconifyIcon icon="material-symbols:content-cut" sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText>Cut</ListItemText>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ⌘X
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconifyIcon icon="material-symbols:content-copy-outline" sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ⌘C
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconifyIcon icon="material-symbols:content-paste" sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText>Paste</ListItemText>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ⌘V
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <IconifyIcon icon="material-symbols:cloud" sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText>Web Clipboard</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
}
render(<IconMenu />)`;

const denseMenuCode = `<Paper sx={{ width: 1, maxWidth: 320 }}>
  <MenuList dense>
    <MenuItem>
      <ListItemText inset>Single</ListItemText>
    </MenuItem>
    <MenuItem>
      <ListItemText inset>1.15</ListItemText>
    </MenuItem>
    <MenuItem>
      <ListItemText inset>Double</ListItemText>
    </MenuItem>
    <MenuItem>
      <ListItemIcon>
        <IconifyIcon icon="material-symbols:check" sx={{ fontSize: 20 }} />
      </ListItemIcon>
      Custom: 1.2
    </MenuItem>
    <Divider />
    <MenuItem>
      <ListItemText>Add space before paragraph</ListItemText>
    </MenuItem>
    <MenuItem>
      <ListItemText>Add space after paragraph</ListItemText>
    </MenuItem>
    <Divider />
    <MenuItem>
      <ListItemText>Custom spacing...</ListItemText>
    </MenuItem>
  </MenuList>
</Paper>`;

const selectedMenuCode = `const options = [
  'Show some love to MUI',
  'Show all notification content',
  'Hide sensitive notification content',
  'Hide all notification content',
];

const SimpleListMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ maxWidth: 'max-content' }}>
      <List
        component="nav"
        aria-label="Device settings"
        sx={{ bgcolor: 'background.paper' }}
      >
        <ListItemButton
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}
        >
          <ListItemText
            primary="When device is locked"
            secondary={options[selectedIndex]}
          />
        </ListItemButton>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'lock-button',
            role: 'listbox',
          },
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            disabled={index === 0}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
render(<SimpleListMenu />);`;

const positionedMenu = `const PositionedMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Dashboard
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
render(<PositionedMenu />)`;

const menuListComositionCode = `const MenuListComposition = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Stack spacing={2} sx={{ flexWrap: 'wrap' }}>
      <Paper>
        <MenuList>
          <MenuItem>Profile</MenuItem>
          <MenuItem>My account</MenuItem>
          <MenuItem>Logout</MenuItem>
        </MenuList>
      </Paper>
      <div>
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          Dashboard
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
}
render(<MenuListComposition />);`;

const accountMenuCode = `const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Fragment>
      <Stack sx={{ alignItems: 'center', textAlign: 'center', overflowX: 'auto' }}>
        <Typography sx={{ minWidth: 100 }}>Contact</Typography>
        <Typography sx={{ minWidth: 100 }}>Profile</Typography>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
          </IconButton>
        </Tooltip>
      </Stack>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              [\`& .\${avatarClasses.root}\`]: {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': (theme) => ({
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                [theme.direction === 'rtl' ? 'left' : 'right']: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              }),
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar sx={{ mr: 1 }} /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar sx={{ mr: 1 }} /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <IconifyIcon icon="material-symbols:person-add" sx={{ fontSize: 20 }} />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <IconifyIcon icon="material-symbols:settings" sx={{ fontSize: 20 }} />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <IconifyIcon icon="material-symbols:logout" sx={{ fontSize: 20 }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
render(<AccountMenu />)`;

const maxHeightMenuCode = `const options = [
  'None',
  'Atria',
  'Callisto',
  'Dione',
  'Ganymede',
  'Hangouts Call',
  'Luna',
  'Oberon',
  'Phobos',
  'Pyxis',
  'Sedna',
  'Titania',
  'Triton',
  'Umbriel',
];

const ITEM_HEIGHT = 48;

const LongMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <IconifyIcon icon="material-symbols:more-vert" sx={{ fontSize: 24 }} />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'long-button',
          },
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
render(<LongMenu />)`;

const changeTransitionCode = `const FadeMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Dashboard
      </Button>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slots={{ transition: Fade }}
        slotProps={{
          list: {
            'aria-labelledby': 'fade-button',
          },
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
render(<FadeMenu />)`;

const contextMenuCode = `const ContextMenu = () => {
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  return (
    <div onContextMenu={handleContextMenu} style={{ cursor: 'context-menu' }}>
      <Typography>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ipsum purus,
        bibendum sit amet vulputate eget, porta semper ligula. Donec bibendum
        vulputate erat, ac fringilla mi finibus nec. Donec ac dolor sed dolor
        porttitor blandit vel vel purus. Fusce vel malesuada ligula. Nam quis
        vehicula ante, eu finibus est.
      </Typography>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleClose}>Copy</MenuItem>
        <MenuItem onClick={handleClose}>Print</MenuItem>
        <MenuItem onClick={handleClose}>Highlight</MenuItem>
        <MenuItem onClick={handleClose}>Email</MenuItem>
      </Menu>
    </div>
  );
}
render(<ContextMenu />)`;

const MenuDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Menu',
        description: 'Menus display a list of choices on temporary surfaces.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Menu',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-menu`,
        folderLink: `${folderBaseLink}/MenuDoc.jsx`,
      }}
    >
      <DocSection
        title="Basic menu"
        // description="A basic menu opens over the anchor element by default, adjustable via props."
      >
        <DocCard code={basicMenuCode} noInline />
      </DocSection>
      <DocSection
        title="Icon menu"
        description="In desktop viewport, padding is increased to give more space to the menu."
      >
        <DocCard code={iconMenuCode} noInline />
      </DocSection>
      <DocSection
        title="Dense menu"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            For the menu that has long list and long text, you can use the <Code>dense</Code> prop
            to reduce the padding and text size.
          </Typography>
        }
      >
        <DocCard code={denseMenuCode} />
      </DocSection>
      <DocSection
        title="Selected menu"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            If used for item selection, when opened, simple menus places the initial focus on the
            selected menu item. The currently selected menu item is set using the{' '}
            <Code>selected</Code> prop (from{' '}
            <Link href="https://mui.com/material-ui/api/list-item">ListItem</Link>). To use a
            selected menu item without impacting the initial focus, set the <Code>variant</Code>{' '}
            prop to "menu".
          </Typography>
        }
      >
        <DocCard code={selectedMenuCode} noInline />
      </DocSection>
      <DocSection
        title="Positioned menu"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Because the <Code>Menu</Code> component uses the <Code>Popover</Code> component to
            position itself, you can use the same positioning props to position it.
          </Typography>
        }
      >
        <DocCard code={positionedMenu} noInline />
      </DocSection>
      <DocSection
        title="MenuList composition"
        descriptionEl={
          <>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              The <Code>Menu</Code> component uses the <Code>Popover</Code> component internally.
              However, you might want to use a different positioning strategy, or not blocking the
              scroll. For answering those needs, we expose a <Code>MenuList</Code> component that
              you can choose, with <Code>Paper</Code> in this example.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              The primary responsibility of the <Code>MenuList</Code> component is to handle the
              focus.
            </Typography>
          </>
        }
      >
        <DocCard code={menuListComositionCode} noInline />
      </DocSection>
      <DocSection
        title="Account menu"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            <Code>Menu</Code> content can be mixed with other components like <Code>Avatar</Code>.
          </Typography>
        }
      >
        <DocCard code={accountMenuCode} noInline />
      </DocSection>
      <DocSection
        title="Max height menu"
        description="If the height of the menu prevents all menu items from being displayed, the menu can scroll internally."
      >
        <DocCard code={maxHeightMenuCode} noInline />
      </DocSection>
      <DocSection title="Change transition" description="Use a different transition.">
        <DocCard code={changeTransitionCode} noInline />
      </DocSection>
      <DocSection
        title="Context menu"
        description="Here is an example of a context menu. (Right click to open.)"
      >
        <DocCard code={contextMenuCode} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default MenuDoc;
