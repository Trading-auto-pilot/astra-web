import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import {
  Backdrop,
  IconButton,
  ListItem,
  ListSubheader,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { useThemeMode } from 'hooks/useThemeMode';
import DocSearch from 'layouts/main-layout/sidenav/doc-search/DocSearch';
import { mainDrawerWidth } from 'lib/constants';
import { cssVarRgba } from 'lib/utils';
import { useAuth } from 'providers/AuthProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useSettingsContext } from 'providers/SettingsProvider';
import { demoUser } from 'providers/auth-provider/AuthJwtProvider';
import sitemap from 'routes/sitemap';
import { sidenavVibrantStyle } from 'theme/styles/vibrantNav';
import IconifyIcon from 'components/base/IconifyIcon';
import StatusAvatar from 'components/base/StatusAvatar';
import Logo from 'components/common/Logo';
import VibrantBackground from 'components/common/VibrantBackground';
import { useNavContext } from '../NavProvider';
import NavItem from './NavItem';

const StackedSidenav = () => {
  const { pathname } = useLocation();
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [mouseEntered, setMouseEntered] = useState(false);
  const {
    config: { sidenavCollapsed, drawerWidth, navigationMenuType, navColor },
    toggleNavbarCollapse,
  } = useSettingsContext();
  const { sidenavAppbarVariant } = useNavContext();
  const { currentBreakpoint } = useBreakpoints();
  const { isDark } = useThemeMode();

  const isMenuActive = (item) => {
    const checkLink = (subMenuItem) => {
      if (
        `${subMenuItem.path}` === pathname ||
        (subMenuItem.selectionPrefix && pathname.includes(subMenuItem.selectionPrefix))
      ) {
        return true;
      }

      return subMenuItem.items && subMenuItem.items.some(checkLink);
    };

    return item.items.some(checkLink);
  };

  const { sessionUser } = useAuth();

  // Demo user data used for development purposes
  const user = useMemo(() => sessionUser || demoUser, [sessionUser]);

  const drawer = (
    <Box sx={{ flex: 1, overflow: 'hidden' }}>
      <Stack sx={{ height: 1 }}>
        {navColor === 'vibrant' && <VibrantBackground position="side" />}
        <Box
          className="leftside-panel"
          sx={[
            {
              display: 'flex',
              flexDirection: 'column',
              width: mainDrawerWidth.stackedNavCollapsed,
              bgcolor: 'background.elevation2',
            },
          ]}
        >
          <Toolbar
            variant={sidenavAppbarVariant}
            sx={[
              {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
              sidenavCollapsed && {
                display: 'flex',
                alignItems: 'center',
              },
            ]}
          >
            {navigationMenuType === 'sidenav' && <Logo showName={false} />}
          </Toolbar>
          <Box
            sx={{
              p: 2,
              flex: 1,
            }}
          >
            <List
              component="nav"
              sx={{
                py: 0,
              }}
            >
              {sitemap.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    p: 0,
                    pb: 1,
                    position: 'relative',
                    '&::after ': {
                      content: '""',
                      position: 'absolute',
                      width: 30,
                      top: 0,
                      bottom: 0,
                      left: '100%',
                      zIndex: 100,
                    },
                  }}
                  onMouseEnter={() => {
                    if (sidenavCollapsed) {
                      setMouseEntered(true);
                      setSelectedMenu(item);
                    }
                  }}
                  onMouseLeave={() => {
                    if (sidenavCollapsed) {
                      setMouseEntered(false);
                    }
                  }}
                >
                  <IconButton
                    className={clsx({
                      active: isMenuActive(item),
                    })}
                    color="primary"
                    sx={[
                      {
                        color: 'text.secondary',
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: ({ vars }) =>
                            cssVarRgba(vars.palette.common.whiteChannel, isDark ? 0.1 : 0.7),
                        },
                      },
                      isMenuActive(item) && {
                        color: 'primary.main',
                      },
                      selectedMenu?.id === item.id && {
                        bgcolor: ({ vars }) =>
                          cssVarRgba(vars.palette.common.whiteChannel, isDark ? 0.1 : 0.7),
                      },
                    ]}
                    onClick={() => {
                      setSelectedMenu(item);
                    }}
                  >
                    <IconifyIcon icon={item.icon} sx={{ fontSize: 24 }} />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Toolbar sx={{ padding: '0 !important', display: 'flex', justifyContent: 'center' }}>
            <IconButton sx={{ color: 'text.secondary' }} onClick={toggleNavbarCollapse}>
              <IconifyIcon
                icon={
                  sidenavCollapsed
                    ? 'material-symbols:left-panel-open-outline'
                    : 'material-symbols:left-panel-close-outline'
                }
              />
            </IconButton>
          </Toolbar>
        </Box>
        <Box
          onMouseOver={() => {
            if (sidenavCollapsed) {
              setMouseEntered(true);
            }
          }}
          onMouseOut={() => {
            if (sidenavCollapsed) {
              setMouseEntered(false);
            }
          }}
          sx={[
            {
              overflow: 'hidden',
              flex: 1,
              px: 1,
              position: 'relative',
            },
          ]}
        >
          <Toolbar variant={sidenavAppbarVariant} sx={{ p: { xs: 2 }, pr: { xs: 1 } }}>
            {navigationMenuType === 'sidenav' && (
              <Stack
                sx={{
                  alignItems: 'center',
                  gap: 1,
                  width: 1,
                }}
              >
                <StatusAvatar
                  status="online"
                  alt={user.name}
                  src={user.avatar || undefined}
                  sx={{ width: 36, height: 36 }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    textWrap: 'nowrap',
                  }}
                >
                  {user.name}
                </Typography>
                <IconButton sx={{ ml: 'auto' }}>
                  <IconifyIcon icon="material-symbols:settings-outline" />
                </IconButton>
              </Stack>
            )}
          </Toolbar>
          <Box sx={{ pt: 2 }}>
            <List
              dense
              subheader={
                selectedMenu?.subheader && (
                  <ListSubheader
                    component="div"
                    disableGutters
                    sx={{
                      typography: 'body1',
                      textAlign: 'left',
                      color: 'text.primary',
                      fontWeight: 700,
                      py: 1,
                      paddingLeft: 2,
                      mb: 1,
                      bgcolor: 'transparent',
                      position: 'static',
                    }}
                  >
                    {selectedMenu.subheader}
                  </ListSubheader>
                )
              }
            >
              {selectedMenu?.subheader === 'Docs' && <DocSearch />}
              {selectedMenu?.items.map((item) => (
                <NavItem key={item.pathName} item={item} level={0} />
              ))}
            </List>
          </Box>
        </Box>
      </Stack>
    </Box>
  );

  const theme = useTheme();

  useEffect(() => {
    if (sidenavCollapsed) {
      setMouseEntered(false);
    }
  }, [pathname]);

  useEffect(() => {
    const activeMenu = sitemap.find(isMenuActive);
    setSelectedMenu(activeMenu || null);
  }, []);

  return (
    <Box
      component="nav"
      className="stacked-sidenav"
      sx={[
        {
          width: { md: drawerWidth },
          flexShrink: { sm: 0 },
          position: { md: 'absolute', lg: mouseEntered ? 'absolute' : 'static' },
          transition: theme.transitions.create(['width'], {
            duration: theme.transitions.duration.standard,
          }),
        },
        !sidenavCollapsed && {
          transition: theme.transitions.create(['width'], {
            duration: theme.transitions.duration.standard,
          }),
        },
        mouseEntered && {
          position: { lg: 'absolute' },
          width: { lg: mainDrawerWidth.full },
          '~': {
            main: {
              ml: `${mainDrawerWidth.stackedNavCollapsed}px`,
            },
          },
        },
        navColor === 'vibrant' && sidenavVibrantStyle,
      ]}
    >
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          [`& .${drawerClasses.paper}`]: {
            boxSizing: 'border-box',
            width: mouseEntered ? mainDrawerWidth.full : drawerWidth,
            transition: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.standard,
            }),
          },
        }}
        open
      >
        {drawer}
        <Divider />
      </Drawer>
      {currentBreakpoint === 'md' && (
        <Backdrop open={!sidenavCollapsed} sx={{ zIndex: 1199 }} onClick={toggleNavbarCollapse} />
      )}
    </Box>
  );
};

export default StackedSidenav;
