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

const TopnavSlim = ({ sx }) => {
  const {
    config: { navColor, navigationMenuType },
    handleDrawerToggle,
  } = useSettingsContext();

  const { up } = useBreakpoints();
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
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {navColor === 'vibrant' && <VibrantBackground position="top" />}
      <Toolbar variant="appbarSlim" sx={{ px: { xs: 3, md: 5 }, maxHeight: 38 }}>
        <Box
          sx={{
            display: { xs: 'flex' },
            alignItems: 'center',
            gap: 1,
            mr: 5,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={[
              {
                display: { xs: 'flex', lg: 'none' },
              },
              navigationMenuType === 'combo' && {
                display: { md: 'none' },
              },
            ]}
          >
            <IconifyIcon icon="material-symbols:menu-rounded" sx={{ fontSize: 20 }} />
          </IconButton>

          <Logo showName={false} sx={{ height: 24, width: 15 }} />
        </Box>

        <Stack
          sx={{
            alignItems: 'center',
            flex: 1,
          }}
        >
          {upLg && <TopnavItems type="slim" />}
          <AppbarActionItems
            type="slim"
            searchComponent={
              <SearchBoxButton
                type="slim"
                variant="soft"
                color="neutral"
                sx={[
                  {
                    borderRadius: 11,
                  },
                ]}
              />
            }
          />
        </Stack>
      </Toolbar>
      <Divider />
    </MuiAppBar>
  );
};

export default TopnavSlim;
