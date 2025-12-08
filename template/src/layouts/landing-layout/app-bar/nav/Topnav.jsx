import { useState } from 'react';
import { useLocation } from 'react-router';
import { Grid, List, ListSubheader, Popover } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconifyIcon from 'components/base/IconifyIcon';
import NavItem from './NavItem';
import PromoCard from './PromoCard';

const Topnav = ({ menus, anchorRef }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { pathname } = useLocation();

  const handlePopoverOpen = () => {
    setAnchorEl(anchorRef.current);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Stack
      sx={{
        alignItems: 'center',
        gap: '2px',
      }}
      className="nav-items"
    >
      {menus.map((menu) => {
        const isActive = menu.href === pathname;

        return (
          <div key={menu.label}>
            <Button
              variant="text"
              href={menu.href}
              onClick={menu.submenus ? handlePopoverOpen : undefined}
              color={isActive ? 'primary' : 'neutral'}
              endIcon={
                menu.submenus ? <IconifyIcon icon="material-symbols:expand-more-rounded" /> : null
              }
              sx={{ fontSize: 14 }}
            >
              {menu.label}
            </Button>

            {menu.submenus && (
              <Popover
                id="mouse-over-popover"
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                onClose={handlePopoverClose}
                slotProps={{
                  paper: {
                    sx: {
                      maxWidth: 900,
                      width: 1,
                    },
                  },
                }}
              >
                <Grid container sx={{ p: 3, width: 1 }} spacing={2}>
                  <Grid component={List} disablePadding size={4}>
                    <ListSubheader
                      sx={{
                        fontWeight: 700,
                        color: 'text.disabled',
                        bgcolor: 'transparent',
                        lineHeight: 1.2,
                        mb: 2,
                      }}
                    >
                      Quick Links
                    </ListSubheader>
                    {menu.submenus.slice(0, 4).map((submenu) => (
                      <NavItem
                        key={submenu.label}
                        menu={submenu}
                        handlePopoverClose={handlePopoverClose}
                      />
                    ))}
                  </Grid>

                  <Grid component={List} disablePadding size={4}>
                    <ListSubheader
                      sx={{
                        fontWeight: 700,
                        color: 'text.disabled',
                        bgcolor: 'transparent',
                        lineHeight: 1.2,
                        mb: 2,
                      }}
                    >
                      Other Pages
                    </ListSubheader>
                    {menu.submenus.slice(4).map((submenu) => (
                      <NavItem
                        key={submenu.label}
                        menu={submenu}
                        handlePopoverClose={handlePopoverClose}
                      />
                    ))}
                  </Grid>

                  <Grid size={4}>
                    <PromoCard />
                  </Grid>
                </Grid>
              </Popover>
            )}
          </div>
        );
      })}
    </Stack>
  );
};

export default Topnav;
