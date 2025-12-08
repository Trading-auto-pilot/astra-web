import { Box, Divider, Stack, paperClasses } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useSettingsContext } from 'providers/SettingsProvider';
import { topnavVibrantStyle } from 'theme/styles/vibrantNav';
import IconifyIcon from 'components/base/IconifyIcon';
import Logo from 'components/common/Logo';
import VibrantBackground from 'components/common/VibrantBackground';
import AppbarActionItems from '../common/AppbarActionItems';
import { SearchBoxButton } from '../common/search-box/SearchBox';
import TopnavItems from './TopnavItems';

const Topnav = () => {
  const {
    config: { navigationMenuType, navColor },
    handleDrawerToggle,
  } = useSettingsContext();

  const { up } = useBreakpoints();
  const upSm = up('sm');
  const upLg = up('lg');

  return (
    <MuiAppBar
      position="fixed"
      sx={[
        {
          width: 1,
          [`&.${paperClasses.root}`]: {
            outline: 'none',
          },
        },
        navigationMenuType === 'combo' && {
          zIndex: ({ zIndex }) => zIndex.drawer + 1,
        },
        navColor === 'vibrant' && topnavVibrantStyle,
      ]}
    >
      {navColor === 'vibrant' && <VibrantBackground position="top" />}
      <Toolbar variant="appbar" sx={{ px: { xs: 3, md: 5, position: 'relative' } }}>
        <Box
          sx={{
            display: { xs: 'flex' },
            alignItems: 'center',
            gap: 1,
            pr: 2,
            mr: 1,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={[
              {
                display: 'flex',
              },
              (navigationMenuType === 'sidenav' || navigationMenuType === 'combo') && {
                display: { md: 'none' },
              },
              navigationMenuType === 'topnav' && {
                display: { lg: 'none' },
              },
            ]}
          >
            <IconifyIcon icon="material-symbols:menu-rounded" sx={{ fontSize: 20 }} />
          </IconButton>

          <Logo showName={upSm} />
        </Box>
        <Stack
          sx={{
            alignItems: 'center',
            flex: 1,
          }}
        >
          {upLg && <TopnavItems />}
          <AppbarActionItems
            searchComponent={
              <Box sx={{ pr: 1.5 }}>
                <SearchBoxButton variant="soft" color="neutral" />
              </Box>
            }
          />
        </Stack>
      </Toolbar>
      <Divider />
    </MuiAppBar>
  );
};

export default Topnav;
