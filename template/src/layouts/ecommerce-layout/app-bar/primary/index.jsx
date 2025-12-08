import { useRef, useState } from 'react';
import { Box, Button, InputAdornment, Stack, Toolbar, inputBaseClasses } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import { useThemeMode } from 'hooks/useThemeMode';
import LanguageMenu from 'layouts/main-layout/common/LanguageMenu';
import SearchTextField from 'layouts/main-layout/common/search-box/SearchTextField';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useEcommerce } from 'providers/EcommerceProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import Logo from 'components/common/Logo';
import OutlinedBadge from 'components/styled/OutlinedBadge';
import CartDrawer from './CartDrawer';
import CategoryPopover from './CategoryPopover';
import ProfileMenu from './ProfileMenu';
import SearchMenu from './SearchMenu';

const PrimaryAppbar = ({ children }) => {
  const categoryBtnRef = useRef(null);
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const [openItem, setOpenItem] = useState(0);

  const { up, currentBreakpoint } = useBreakpoints();
  const { isDark, setThemeMode } = useThemeMode();

  const { cartItems } = useEcommerce();

  return (
    <MuiAppBar>
      <Toolbar
        component="nav"
        variant="appbar"
        sx={{ px: { xs: 3, md: 5 }, py: { xs: 1, md: 0 }, minHeight: { md: 78 } }}
      >
        <Grid
          container
          spacing={{ xs: 1, md: 2 }}
          sx={{
            width: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Grid size="auto">
            <Logo showName={up('sm')} />
          </Grid>
          <Grid
            sx={{
              order: { md: 1 },
            }}
            size="auto"
          >
            <Stack
              sx={{
                alignItems: 'center',
                gap: 1,
              }}
            >
              <LanguageMenu />
              <Button color="neutral" variant="soft" shape="circle" onClick={() => setThemeMode()}>
                <IconifyIcon
                  icon={
                    isDark
                      ? 'material-symbols-light:light-off-outline-rounded'
                      : 'material-symbols-light:lightbulb-outline-rounded'
                  }
                  sx={{ fontSize: 22 }}
                />
              </Button>
              <OutlinedBadge color="error" overlap="circular" badgeContent={cartItems.length}>
                <Button
                  color="neutral"
                  variant="soft"
                  shape="circle"
                  onClick={() => setOpenCartDrawer(true)}
                >
                  <IconifyIcon
                    icon="material-symbols-light:shopping-cart-outline-rounded"
                    sx={{ fontSize: 22 }}
                  />
                </Button>
              </OutlinedBadge>

              <ProfileMenu />
            </Stack>
          </Grid>
          <Grid
            sx={{ flexGrow: { xs: 1 } }}
            size={{
              xs: 12,
              md: 'auto',
            }}
          >
            <Stack
              spacing={{ xs: 1, lg: 3 }}
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                color="neutral"
                variant="soft"
                shape={
                  currentBreakpoint === 'xs' || currentBreakpoint === 'md' ? 'circle' : undefined
                }
                ref={categoryBtnRef}
                onClick={() => {
                  setOpenItem(1);
                }}
                sx={{
                  gap: 1,
                  borderRadius: 7,
                  flexShrink: 0,
                }}
              >
                <IconifyIcon
                  icon="material-symbols:menu"
                  sx={{
                    fontSize: 20,
                    display: 'inline-block',
                    width: 20,
                    height: 20,
                  }}
                />
                <Box
                  component="span"
                  sx={{
                    display: { xs: 'none', sm: 'block', md: 'none', lg: 'block' },
                  }}
                >
                  Category
                </Box>
              </Button>

              <CategoryPopover
                anchorEl={categoryBtnRef.current}
                openItem={openItem}
                setOpenItem={setOpenItem}
                handleClose={() => {
                  setOpenItem(0);
                }}
              />

              <Stack spacing={0.5} sx={{ width: 1, maxWidth: { lg: 602 } }}>
                {up('lg') && <SearchMenu />}

                <SearchTextField
                  component="form"
                  sx={{
                    [`& .${inputBaseClasses.root}`]: { borderRadius: 6 },
                    flexGrow: 1,
                  }}
                  placeholder="Search product"
                  slotProps={{
                    input: {
                      inputProps: {
                        style: { fontSize: 14 },
                      },
                      startAdornment: null,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconifyIcon
                            icon="material-symbols:search-rounded"
                            sx={{ fontSize: 24 }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Toolbar>
      {children}
      <CartDrawer open={openCartDrawer} handleClose={() => setOpenCartDrawer(false)} />
    </MuiAppBar>
  );
};

export default PrimaryAppbar;
