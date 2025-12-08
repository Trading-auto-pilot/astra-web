import { Box, Button, Drawer, Stack, Typography, drawerClasses } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import FilterPanel from './filter-panel';

const FilterDrawer = ({ open, handleClose, drawerWidth, filterOptions }) => {
  const { up } = useBreakpoints();
  const upMd = up('md');

  return (
    <>
      {upMd ? (
        <Drawer
          variant="persistent"
          open={open}
          sx={(theme) => ({
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
            [`& .${drawerClasses.paper}`]: {
              position: 'sticky',
              zIndex: 'unset',
              top: theme.mixins.ecommerceTopbar,
              border: 0,
              overflowY: 'auto',
              width: drawerWidth,
              height: theme.mixins.contentHeight(theme.mixins.ecommerceTopbar),
              outline: `1px solid ${theme.vars.palette.divider}`,
              bgcolor: theme.vars.palette.background.elevation1,
            },
          })}
        >
          <Box sx={{ px: { xs: 3, md: 5 }, py: 3 }}>
            <FilterPanel filterOptions={filterOptions} />
          </Box>
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={(theme) => ({
            display: { xs: 'block', md: 'none' },
            [`& .${drawerClasses.paper}`]: {
              width: drawerWidth,
              border: 0,
              outline: `1px solid ${theme.vars.palette.divider}`,
              bgcolor: theme.vars.palette.background.elevation1,
            },
          })}
        >
          <Stack
            direction="column"
            sx={{
              gap: 3,
              px: { xs: 3, md: 5 },
              py: 3,
            }}
          >
            <Stack
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 700,
                }}
              >
                Filters
              </Typography>
              <Button shape="circle" variant="soft" color="neutral" onClick={handleClose}>
                <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 20 }} />
              </Button>
            </Stack>
            <FilterPanel filterOptions={filterOptions} />
          </Stack>
        </Drawer>
      )}
    </>
  );
};

export default FilterDrawer;
