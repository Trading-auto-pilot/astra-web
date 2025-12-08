import { useMemo } from 'react';
import { Drawer, drawerClasses } from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import useSettingsPanelMountEffect from 'hooks/useSettingsPanelMountEffect';
import AppBar from 'layouts/main-layout/app-bar';
import Sidenav from 'layouts/main-layout/sidenav';
import { mainDrawerWidth } from 'lib/constants';
import { useSettingsContext } from 'providers/SettingsProvider';
import { sidenavVibrantStyle } from 'theme/styles/vibrantNav';
import VibrantBackground from 'components/common/VibrantBackground';
import NavProvider from './NavProvider';
import Footer from './footer';
import SidenavDrawerContent from './sidenav/SidenavDrawerContent';
import Topnav from './topnav';

// import TopnavSlim from './topnav/TopnavSlim';
// import StackedSidenav from './sidenav/StackedSidenav';
// import TopNavStacked from './topnav/TopNavStacked';
// import SlimSidenav from './sidenav/SlimSidenav';

const ComboLayout = ({ children }) => {
  const {
    config: {
      drawerWidth,
      sidenavType,
      navigationMenuType,
      topnavType,
      openNavbarDrawer,
      navColor,
    },
    setConfig,
  } = useSettingsContext();

  const toggleNavbarDrawer = () => {
    setConfig({
      openNavbarDrawer: !openNavbarDrawer,
    });
  };
  useSettingsPanelMountEffect({
    disableNavigationMenuSection: true,
    disableSidenavShapeSection: true,
    disableTopShapeSection: true,
  });

  const toolbarVarint = useMemo(() => {
    if (navigationMenuType !== 'sidenav') {
      if (topnavType === 'slim') {
        return 'appbarSlim';
      }
      if (topnavType === 'stacked') {
        return 'appbarStacked';
      }
    }

    return 'appbar';
  }, [navigationMenuType, topnavType]);

  return (
    <Box>
      <Box
        className={clsx({
          'nav-vibrant': navColor === 'vibrant',
        })}
        sx={{ display: 'flex', zIndex: 1, position: 'relative' }}
      >
        <NavProvider>
          <AppBar />

          <Sidenav />
          {/* <SlimSidenav /> */}
          {/* <StackedSidenav /> */}

          <Topnav />
          {/* <TopnavSlim /> */}
          {/* <TopNavStacked /> */}

          <Drawer
            variant="temporary"
            open={openNavbarDrawer}
            onClose={toggleNavbarDrawer}
            ModalProps={{
              keepMounted: true,
            }}
            sx={[
              {
                display: { xs: 'block', md: 'none' },
                [`& .${drawerClasses.paper}`]: {
                  pt: 3,
                  boxSizing: 'border-box',
                  width: mainDrawerWidth.full,
                },
              },
              navColor === 'vibrant' && sidenavVibrantStyle,
            ]}
          >
            {navColor === 'vibrant' && <VibrantBackground position="side" />}
            <SidenavDrawerContent variant="temporary" />
          </Drawer>

          <Box
            component="main"
            sx={[
              {
                flexGrow: 1,
                p: 0,
                minHeight: '100vh',
                width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
                display: 'flex',
                flexDirection: 'column',
              },
              sidenavType === 'default' && {
                ml: { md: `${mainDrawerWidth.collapsed}px`, lg: 0 },
              },
              sidenavType === 'stacked' && {
                ml: { md: `${mainDrawerWidth.stackedNavCollapsed}px`, lg: 0 },
              },
              sidenavType === 'slim' && {
                ml: { xs: 0 },
              },
            ]}
          >
            <Toolbar variant={toolbarVarint} />

            <Box sx={{ flex: 1 }}>
              <Box
                sx={[
                  {
                    height: 1,
                    bgcolor: 'background.default',
                  },
                ]}
              >
                {children}
              </Box>
            </Box>
            <Footer />
          </Box>
        </NavProvider>
      </Box>
    </Box>
  );
};

export default ComboLayout;
