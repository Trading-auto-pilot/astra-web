import { useTheme } from '@mui/material';
import { initialConfig } from 'config';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const avatar = (index) => `${initialConfig.assetsDir}/images/avatar/${index}.webp`;

const basicAppBarCode = `<Box sx={{ flexGrow: 1 }}>
  <AppBar position="static">
    <Toolbar>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
      >
        <IconifyIcon icon="material-symbols:menu" sx={{ fontSize: 24 }} />
      </IconButton>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        News
      </Typography>
      <Button color="inherit">Login</Button>
    </Toolbar>
  </AppBar>
</Box>`;

const appBarWithMenuCode = `import { useTheme } from '@mui/material';

const MenuAppBar = () => {
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const { direction } = useTheme();

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <FormGroup sx={{ mb: 2, maxWidth: 'fit-content' }}>
        <FormControlLabel
          control={
            <Switch
              checked={auth}
              onChange={handleChange}
              aria-label="login switch"
            />
          }
          label={auth ? 'Logout' : 'Login'}
          sx={{ mx: 0, gap: 1 }}
        />
      </FormGroup>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <IconifyIcon icon="material-symbols:menu" sx={{ fontSize: 24 }} />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Photos
          </Typography>
          {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <IconifyIcon icon="material-symbols:account-circle" sx={{ fontSize: 24 }} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: direction === 'rtl' ? 'left' : 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: direction === 'rtl' ? 'left' : 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
render(<MenuAppBar />)`;

const responsiveAppBarCode = `import { useTheme } from '@mui/material';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { direction } = useTheme();

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<IconifyIcon icon="material-symbols:adb" sx={{ fontSize: 24, display: { xs: 'none', lg: 'flex' }, mr: 1 }} />
					<Typography
						variant="h6"
						noWrap
						component="a"
						href="#app-bar-with-responsive-menu"
						sx={{
							mr: 2,
							display: { xs: 'none', lg: 'flex' },
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						LOGO
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: 'flex', lg: 'none' } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<IconifyIcon icon="material-symbols:menu" sx={{ fontSize: 24 }} />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', lg: 'none' },
							}}
						>
							{pages.map((page) => (
								<MenuItem key={page} onClick={handleCloseNavMenu}>
									<Typography sx={{ textAlign: 'center' }}>{page}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<IconifyIcon icon="material-symbols:adb" sx={{ fontSize: 24, display: { xs: 'flex', lg: 'none' }, mr: 1 }} />
					<Typography
						variant="h5"
						noWrap
						component="a"
						href="#app-bar-with-responsive-menu"
						sx={{
							mr: 2,
							display: { xs: 'flex', lg: 'none' },
							flexGrow: 1,
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						LOGO
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: 'none', lg: 'flex' } }}>
						{pages.map((page) => (
							<Button
								key={page}
								color="neutral"
								onClick={handleCloseNavMenu}
								sx={{ my: 2, display: 'block' }}
							>
								{page}
							</Button>
						))}
					</Box>

					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Open settings">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar alt="Remy Sharp" src="${avatar(2)}" />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{settings.map((setting) => (
								<MenuItem key={setting} onClick={handleCloseUserMenu}>
									<Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
render(<ResponsiveAppBar />)`;

const searchFieldAppBarCode = `const SearchAppBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <IconifyIcon icon="material-symbols:menu" sx={{ fontSize: 24 }} />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            MUI
          </Typography>
          <TextField
            placeholder="Search..."
            slotProps={{
  						input: {
    						startAdornment: (
                  <InputAdornment position="start">
                    <IconifyIcon icon="material-symbols:search" sx={{ fontSize: 24 }} />
                  </InputAdornment>
                ),
              }
						}}
            sx={(theme) => ({
              [\`& .\${inputBaseClasses.input}\`]: {
                py: 1,
                transition: theme.transitions.create('width'),
                [theme.breakpoints.up('sm')]: {
                  width: '12ch',
                  '&:focus': {
                    width: '20ch',
                  },
                },
              }
            })}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
render(<SearchAppBar />)`;

const responsiveAppBarWithDrawerCode = `const drawerWidth = 240;
const navItems = ['Home', 'About', 'Contact'];

const DrawerAppBar = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const id = 'my-box'

  const container = window !== undefined ? () => document.getElementById('my-box') : undefined;

  return (
    <Box id="my-box" sx={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      <AppBar component="nav" position="sticky" sx={{ zIndex: (theme) => theme.zIndex.appBar - 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <IconifyIcon icon="material-symbols:menu" sx={{ fontSize: 24 }} />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            MUI
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: 'text.primary' }}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            [\`& .\${drawerClasses.paper}\`]: {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Typography>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique unde
          fugit veniam eius, perspiciatis sunt? Corporis qui ducimus quibusdam,
          aliquam dolore excepturi quae. Distinctio enim at eligendi perferendis in
          cum quibusdam sed quae, accusantium et aperiam? Quod itaque exercitationem,
        </Typography>
      </Box>
    </Box>
  );
}
render(<DrawerAppBar />);`;

const primarySearchFieldAppBarCode = `import { useTheme } from '@mui/material';

const PrimarySearchAppBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
	const { direction } = useTheme();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: direction === 'rtl' ? 'left' : 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: direction === 'rtl' ? 'left' : 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <IconifyIcon icon="material-symbols:mail" sx={{ fontSize: 24 }} />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <IconifyIcon icon="material-symbols:notifications" sx={{ fontSize: 24 }} />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <IconifyIcon icon="material-symbols:account-circle" sx={{ fontSize: 24 }} />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <IconifyIcon icon="material-symbols:menu" sx={{ fontSize: 24 }} />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ display: { xs: 'none', sm: 'block',} }}
          >
            MUI
          </Typography>
          <TextField
            placeholder="Search..."
            slotProps={{
  						input: {
    						startAdornment: (
                  <InputAdornment position="start">
                    <IconifyIcon icon="material-symbols:search" sx={{ fontSize: 24 }} />
                  </InputAdornment>
                ),
              }
						}}
            sx={(theme) => ({
              marginRight: theme.spacing(2),
              marginLeft: 0,
              width: '100%',
              [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
              },
              [\`& .\${inputBaseClasses.input}\`]: {
                py: 1,
                transition: theme.transitions.create('width'),
                width: '100%',
                [theme.breakpoints.up('md')]: {
                  width: '20ch',
                },
              }
            })}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', lg: 'flex' } }}>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <IconifyIcon icon="material-symbols:mail" sx={{ fontSize: 24 }} />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <IconifyIcon icon="material-symbols:notifications" sx={{ fontSize: 24 }} />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <IconifyIcon icon="material-symbols:account-circle" sx={{ fontSize: 24 }} />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', lg: 'none' } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <IconifyIcon icon="material-symbols:more-vert" sx={{ fontSize: 24 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
render(<PrimarySearchAppBar />)`;

const denseAppBarCode = `<AppBar position="static">
  <Toolbar variant="dense">
    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
      <IconifyIcon icon="material-symbols:menu" sx={{ fontSize: 24 }} />
    </IconButton>
    <Typography variant="h6" color="inherit" component="div">
      Photos
    </Typography>
  </Toolbar>
</AppBar>`;

const prominentAppBarCode = `const ProminentAppBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={(theme) => ({
          alignItems: 'flex-start',
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(2),
          '@media all': {
            minHeight: 128,
          },
        })}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <IconifyIcon icon="material-symbols:menu" sx={{ fontSize: 24 }} />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ flexGrow: 1, alignSelf: 'flex-end' }}
          >
            MUI
          </Typography>
          <IconButton size="large" aria-label="search" color="inherit">
            <IconifyIcon icon="material-symbols:search" sx={{ fontSize: 24 }} />
          </IconButton>
          <IconButton
            size="large"
            aria-label="display more actions"
            edge="end"
            color="inherit"
          >
            <IconifyIcon icon="material-symbols:more-vert" sx={{ fontSize: 24 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
render(<ProminentAppBar />)`;

const bottomAppBarCode = `const messages = [
  {
    id: 1,
    primary: 'Brunch this week?',
    secondary: "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: "${avatar(5)}",
  },
  {
    id: 2,
    primary: 'Birthday Gift',
    secondary: \`Do you have a suggestion for a good present for John on his work
      anniversary. I am really confused & would love your thoughts on it.\`,
    person: "${avatar(1)}",
  },
  {
    id: 3,
    primary: 'Recipe to try',
    secondary: 'I am try out this new BBQ recipe, I think this might be amazing',
    person: "${avatar(2)}",
  },
  {
    id: 4,
    primary: 'Yes!',
    secondary: 'I have the tickets to the ReactConf for this year.',
    person: "${avatar(3)}",
  },
  {
    id: 5,
    primary: "Doctor's Appointment",
    secondary: 'My appointment for the doctor was rescheduled for next Saturday.',
    person: "${avatar(4)}",
  },
  {
    id: 6,
    primary: 'Discussion',
    secondary: \`Menus that are generated by the bottom app bar (such as a bottom
      navigation drawer or overflow menu) open as bottom sheets at a higher elevation
      than the bar.\`,
    person: "${avatar(6)}",
  },
  {
    id: 7,
    primary: 'Summer BBQ',
    secondary: \`Who wants to have a cookout this weekend? I just got some furniture
      for my backyard and would love to fire up the grill.\`,
    person: "${avatar(8)}",
  },
];

const BottomAppBar = () => {
  return (
    <Fragment>
      <CssBaseline />
      <Paper square sx={{ height: 500, overflow: 'auto' }}>
        <Typography variant="h5" gutterBottom component="div" sx={{ p: 2, pb: 0 }}>
          Inbox
        </Typography>
        <List sx={{ mb: 2 }}>
          {messages.map(({ id, primary, secondary, person }) => (
            <Fragment key={id}>
              {id === 1 && (
                <ListSubheader sx={{ bgcolor: 'background.paper' }}>
                  Today
                </ListSubheader>
              )}

              {id === 3 && (
                <ListSubheader sx={{ bgcolor: 'background.paper' }}>
                  Yesterday
                </ListSubheader>
              )}

              <ListItemButton>
                <ListItemAvatar>
                  <Avatar alt="Profile Picture" src={person} />
                </ListItemAvatar>
                <ListItemText primary={primary} secondary={secondary} />
              </ListItemButton>
            </Fragment>
          ))}
        </List>
      </Paper>
      <AppBar position="sticky" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer">
            <IconifyIcon icon="material-symbols:menu" sx={{ fontSize: 24 }} />
          </IconButton>
          <Fab color="secondary" aria-label="add" sx={{
            position: 'absolute',
            zIndex: 1,
            top: -30,
            left: 0,
            right: 0,
            margin: '0 auto',
          }}>
            <IconifyIcon icon="material-symbols:add" sx={{ fontSize: 24 }} />
          </Fab>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit">
            <IconifyIcon icon="material-symbols:search" sx={{ fontSize: 24 }} />
          </IconButton>
          <IconButton color="inherit">
            <IconifyIcon icon="material-symbols:more-vert" sx={{ fontSize: 24 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
}
render(<BottomAppBar />)`;

const AppBarDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'App Bar',
        description: 'The App Bar displays information and actions relating to the current screen.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'AppBar',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-app-bar`,
        folderLink: `${folderBaseLink}/AppBarDoc.jsx`,
      }}
    >
      <DocSection title="Basic App bar">
        <DocCard code={basicAppBarCode} />
      </DocSection>

      <DocSection title="App bar with menu">
        <DocCard code={appBarWithMenuCode} scope={useTheme} noInline />
      </DocSection>

      <DocSection title="App bar with responsive menu">
        <DocCard code={responsiveAppBarCode} scope={{ useTheme, avatar }} noInline />
      </DocSection>

      <DocSection title="App bar with search field" description="A side searchbar.">
        <DocCard code={searchFieldAppBarCode} noInline />
      </DocSection>

      <DocSection title="Responsive App bar with Drawer">
        <DocCard code={responsiveAppBarWithDrawerCode} noInline />
      </DocSection>

      <DocSection title="App bar with a primary search field" description="A primary searchbar.">
        <DocCard code={primarySearchFieldAppBarCode} scope={useTheme} noInline />
      </DocSection>

      <DocSection title="Dense (desktop only)">
        <DocCard code={denseAppBarCode} />
      </DocSection>

      <DocSection title="Prominent" description="A prominent app bar.">
        <DocCard code={prominentAppBarCode} noInline />
      </DocSection>

      <DocSection title="Bottom App bar">
        <DocCard code={bottomAppBarCode} scope={{ avatar }} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default AppBarDoc;
