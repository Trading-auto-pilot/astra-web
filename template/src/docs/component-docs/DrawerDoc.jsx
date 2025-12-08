import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocNestedSection from 'components/docs/DocNestedSection';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const temporaryDrawerCode = `const TemporaryDrawer = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Inbox', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <IconifyIcon icon="material-symbols-light:inbox" fontSize={24} sx={{ mr: 2 }} />
                ) : (
                  <IconifyIcon icon="material-symbols-light:mail" fontSize={24} sx={{ mr: 2 }} />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <IconifyIcon icon="material-symbols-light:inbox" fontSize={24} sx={{ mr: 2 }} />
                ) : (
                  <IconifyIcon icon="material-symbols-light:mail" fontSize={24} sx={{ mr: 2 }} />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <Button onClick={toggleDrawer(true)}>Open drawer</Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </Stack>
  );
};
render(<TemporaryDrawer/>)
`.trim();

const anchorDrawerCode = `
const AnchorTemporaryDrawer = () => {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Inbox', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <IconifyIcon icon="material-symbols-light:inbox" fontSize={24} sx={{ mr: 2 }} />
                ) : (
                  <IconifyIcon icon="material-symbols-light:mail" fontSize={24} sx={{ mr: 2 }} />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <IconifyIcon icon="material-symbols-light:inbox" fontSize={24} sx={{ mr: 2 }} />
                ) : (
                  <IconifyIcon icon="material-symbols-light:mail" fontSize={24} sx={{ mr: 2 }} />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Stack sx={{ justifyContent: 'center' }}>
      {(['left', 'right', 'top', 'bottom'] as const).map((anchor) => (
        <Box key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </Box>
      ))}
    </Stack>
  );
};
render(<AnchorTemporaryDrawer/>)
`.trim();

const responsiveDrawerCode = `
const drawerWidth = 240;

const ResponsiveDrawer = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['Inbox', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <IconifyIcon icon="material-symbols-light:inbox" sx={{ fontSize: 20, mr: 2 }} />
                ) : (
                  <IconifyIcon icon="material-symbols-light:mail" sx={{ fontSize: 20, mr: 2 }} />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <IconifyIcon icon="material-symbols-light:inbox" sx={{ fontSize: 20, mr: 2 }} />
                ) : (
                  <IconifyIcon icon="material-symbols-light:mail" sx={{ fontSize: 20, mr: 2 }} />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Paper sx={{ display: 'flex', height: 320, position: 'relative', zIndex: 5 }}>
      <CssBaseline />
      <AppBar
        position="absolute"
        sx={{
          width: { sm: \`calc(100% - \${drawerWidth}px)\` },
          ml: { sm: \`\${drawerWidth}px\` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <IconifyIcon icon="material-symbols-light:menu" fontSize={24} />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          position: 'relative',
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
             [\`& .\${drawerClasses.paper}\`]: { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
             [\`& .\${drawerClasses.paper}\`]: {
              boxSizing: 'border-box',
              width: drawerWidth,
              position: { xs: 'static', sm: 'absolute' },
            },
             [\`& .\${drawerClasses.root}\`]: { zIndex: 1000 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: \`calc(100% - \${drawerWidth}px)\` },
          overflow: 'scroll',
        }}
      >
        <Toolbar />
        <Typography component="p" variant="body1" sx={{ mb: 2 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
          facilisis leo vel.
        </Typography>
        <Typography component="p" variant="body1" >
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
          facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
          tincidunt.
        </Typography>
      </Box>
    </Paper>
  );
};
render(<ResponsiveDrawer/>)
`.trim();

const persistantDrawerCode = `
const drawerWidth = 240;

const PersistentDrawerRight = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', height: 320, position: 'relative', zIndex: 5 }}>
      <CssBaseline />
      <AppBar
        position="absolute"
        sx={{
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            width: \`calc(100% - \${drawerWidth}px)\`,
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: \`\${drawerWidth}px\`,
          }),
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
            Persistent drawer
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            sx={{ ...(open && { display: 'none' }) }}
          >
            <IconifyIcon icon="material-symbols-light:menu" fontSize={24} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: theme.spacing(3),
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: \`\${drawerWidth}px\`,
          }),
          height: 320,
          position: 'absolute',
          top: 0,
          overflow: 'scroll',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
            justifyContent: 'flex-start',
          }}
        />
        <Typography component="p" variant="body1" sx={{ mb: 2}} >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
          facilisis leo vel.
        </Typography>
        <Typography component="p" variant="body1" >
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
          facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
          tincidunt.
        </Typography>
      </Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
           [\`& .\${drawerClasses.paper}\`]: {
            width: drawerWidth,
            position: 'absolute',
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
            justifyContent: 'flex-start',
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <IconifyIcon
                icon="material-symbols-light:chevron-left"
                fontSize={24}
              />
            ) : (
              <IconifyIcon
                icon="material-symbols-light:chevron-right"
                fontSize={24}
              />
            )}
          </IconButton>
        </Box>
        <Divider />
        <List>
          {['Inbox', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? (
                    <IconifyIcon icon="material-symbols-light:inbox" fontSize={24} sx={{ mr: 2 }} />
                  ) : (
                    <IconifyIcon icon="material-symbols-light:mail" fontSize={24} sx={{ mr: 2 }} />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? (
                    <IconifyIcon icon="material-symbols-light:inbox" fontSize={24} sx={{ mr: 2 }} />
                  ) : (
                    <IconifyIcon icon="material-symbols-light:mail" fontSize={24} sx={{ mr: 2 }} />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Paper>
  );
};
render(<PersistentDrawerRight/>)
`.trim();

const miniDrawerCode = `
const drawerWidth = 240;

const MiniDrawer = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Paper sx={{ display: 'flex', height: 320, position: 'relative', zIndex: 5 }}>
      <CssBaseline />
      <AppBar
        position="absolute"
        sx={{
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: \`\${drawerWidth}px\`,
            width: \`calc(100% - \${drawerWidth}px)\`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: 'none' },
            ]}
          >
            <IconifyIcon icon="material-symbols-light:menu" fontSize={24} />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Mini variant drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : \`calc(\${theme.spacing(7)} + 1px)\`,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: open
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
           [\`& .\${drawerClasses.paper}\`]: {
            width: open ? drawerWidth : \`calc(\${theme.spacing(7)} + 1px)\`,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: open
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            position: { xs: 'static', sm: 'absolute' },
            [theme.breakpoints.up('sm')]: {
              width: open ? drawerWidth : \`calc(\${theme.spacing(8)} + 1px)\`,
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <IconifyIcon icon="material-symbols-light:chevron-right" />
            ) : (
              <IconifyIcon icon="material-symbols-light:chevron-left" />
            )}
          </IconButton>
        </Box>
        <Divider />
        <List>
          {['Inbox', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: 'auto',
                        },
                  ]}
                >
                  {index % 2 === 0 ? (
                    <IconifyIcon
                      icon="material-symbols-light:inbox"
                      fontSize={24}
                      sx={{ mr: open ? 2 : 0 }}
                    />
                  ) : (
                    <IconifyIcon
                      icon="material-symbols-light:mail"
                      fontSize={24}
                      sx={{ mr: open ? 2 : 0 }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: 'auto',
                        },
                  ]}
                >
                  {index % 2 === 0 ? (
                    <IconifyIcon
                      icon="material-symbols-light:inbox"
                      fontSize={24}
                      sx={{ mr: open ? 2 : 0 }}
                    />
                  ) : (
                    <IconifyIcon
                      icon="material-symbols-light:mail"
                      fontSize={24}
                      sx={{ mr: open ? 2 : 0 }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'scroll' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
          }}
        />
        <Typography sx={{ marginBottom: 2 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
          facilisis leo vel.
        </Typography>
        <Typography sx={{ marginBottom: 2 }}>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
          facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
          tincidunt.
        </Typography>
      </Box>
    </Paper>
  );
};
render(<MiniDrawer/>)
`.trim();

const permenantDrawerCode = `
const drawerWidth = 240;

const PermanentDrawerLeft = () => {
  return (
    <Paper sx={{ display: 'flex', height: 320, position: 'relative', zIndex: 5 }}>
      <CssBaseline />
      <AppBar
        position="absolute"
        sx={{ width: \`calc(100% - \${drawerWidth}px)\`, ml: \`\${drawerWidth}px\` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Permanent drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
           [\`& .\${drawerClasses.paper}\`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            position: { xs: 'static', sm: 'absolute' }
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {['Inbox', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? (
                    <IconifyIcon icon="material-symbols-light:inbox" fontSize={24} sx={{ mr: 2 }} />
                  ) : (
                    <IconifyIcon icon="material-symbols-light:mail" fontSize={24} sx={{ mr: 2 }} />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? (
                    <IconifyIcon icon="material-symbols-light:inbox" fontSize={24} sx={{ mr: 2 }} />
                  ) : (
                    <IconifyIcon icon="material-symbols-light:mail" fontSize={24} sx={{ mr: 2 }} />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          overflow: 'scroll',
        }}
      >
        <Toolbar />
        <Typography sx={{ marginBottom: 2 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
          facilisis leo vel.
        </Typography>
        <Typography sx={{ marginBottom: 2 }}>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
          facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
          tincidunt.
        </Typography>
      </Box>
    </Paper>
  );
};
render(<PermanentDrawerLeft/>)
`.trim();

const clippedDrawerCode = `
const drawerWidth = 240;

const ClippedDrawer = () => {
  return (
    <Paper sx={{ display: 'flex', height: 320, position: 'relative', zIndex: 5 }}>
      <CssBaseline />
      <AppBar position="absolute" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar variant="appbar">
          <Typography variant="h6" noWrap component="div">
            Clipped drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [\`& .\${drawerClasses.paper}\`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            position: { xs: 'static', sm: 'absolute' },
          },
        }}
      >
        <Toolbar />
        <br />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['Inbox', 'Drafts'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? (
                      <IconifyIcon
                        icon="material-symbols-light:inbox"
                        fontSize={24}
                        sx={{ mr: 2 }}
                      />
                    ) : (
                      <IconifyIcon
                        icon="material-symbols-light:mail"
                        fontSize={24}
                        sx={{ mr: 2 }}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? (
                      <IconifyIcon
                        icon="material-symbols-light:inbox"
                        fontSize={24}
                        sx={{ mr: 2 }}
                      />
                    ) : (
                      <IconifyIcon
                        icon="material-symbols-light:mail"
                        fontSize={24}
                        sx={{ mr: 2 }}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'scroll' }}>
        <Toolbar />
        <br />
        <Typography sx={{ marginBottom: 2 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
          facilisis leo vel.
        </Typography>
        <Typography sx={{ marginBottom: 2 }}>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
          facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
          tincidunt.
        </Typography>
      </Box>
    </Paper>
  );
};
render(<ClippedDrawer/>)
`.trim();

const swipeableDrawer = `
type Anchor = 'top' | 'left' | 'bottom' | 'right';

const SwipeableTemporaryDrawer = () => {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: KeyboardEvent | MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Inbox', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <IconifyIcon icon="material-symbols-light:inbox" fontSize={24} sx={{ mr: 2 }} />
                ) : (
                  <IconifyIcon icon="material-symbols-light:mail" fontSize={24} sx={{ mr: 2 }} />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <IconifyIcon icon="material-symbols-light:inbox" fontSize={24} sx={{ mr: 2 }} />
                ) : (
                  <IconifyIcon icon="material-symbols-light:mail" fontSize={24} sx={{ mr: 2 }} />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Stack sx={{ justifyContent: 'center' }}>
      {(['left', 'right', 'top', 'bottom'] as const).map((anchor) => (
        <Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </Fragment>
      ))}
    </Stack>
  );
};
render(<SwipeableTemporaryDrawer/>)
`.trim();

const DrawerDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Drawer',
        description: `The navigation drawers (or "sidebars") provide ergonomic access to destinations in a site or app functionality such as switching accounts.`,
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Drawer',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-drawer`,
        folderLink: `${folderBaseLink}/DrawerDoc.jsx`,
      }}
    >
      <DocSection
        title="Temporary Drawer"
        description="Temporary navigation drawers can toggle open or closed. Closed by default, the drawer opens temporarily above all other content until a section is selected."
      >
        <DocCard code={temporaryDrawerCode} noInline sx={{ mb: 3 }} />
        <DocNestedSection title="Anchor" id="anchor">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use the &nbsp;<Code>anchor</Code>&nbsp; prop to specify which side of the screen the
            Drawer should originate from.
          </Typography>
          <DocCard code={anchorDrawerCode} noInline sx={{ mb: 3 }} />
        </DocNestedSection>
        <DocNestedSection title="Swipeable" id="swipeable">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can make the drawer swipeable with the &nbsp;<Code>SwipeableDrawer</Code>&nbsp;
            component.
          </Typography>
          <DocCard code={swipeableDrawer} noInline sx={{ mb: 3 }} />
        </DocNestedSection>
      </DocSection>
      <DocSection
        title="Responsive Drawer"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can use the &nbsp;<Code>temporary</Code>&nbsp; variant to display a drawer for small
            screens and permanent for a drawer for wider screens.
          </Typography>
        }
      >
        <DocCard code={responsiveDrawerCode} noInline />
      </DocSection>
      <DocSection
        title="Persistent Drawer"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use the &nbsp;<Code>variant="persistent"</Code>&nbsp; prop for navigation drawers that
            toggle open or closed, resizing content, ideal for larger screens.
          </Typography>
        }
      >
        <DocCard code={persistantDrawerCode} noInline />
      </DocSection>
      <DocSection title="Mini Variant Drawer">
        <DocCard code={miniDrawerCode} noInline />
      </DocSection>
      <DocSection
        title="Permanent Drawer"
        description="Permanent navigation drawers are always visible and pinned to the left edge, at the same elevation as the content or background. They cannot be closed."
      >
        <DocNestedSection title="Full-height navigation" id="full-height-navigation">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Apps focused on information consumption that use a left-to-right hierarchy.
          </Typography>
          <DocCard code={permenantDrawerCode} noInline sx={{ mb: 3 }} />
        </DocNestedSection>
        <DocNestedSection title="Clipped under the app bar" id="clipped-under-the-app-bar">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Apps focused on productivity that require balance across the screen.
          </Typography>
          <DocCard code={clippedDrawerCode} noInline />
        </DocNestedSection>
      </DocSection>
    </DocPageLayout>
  );
};

export default DrawerDoc;
