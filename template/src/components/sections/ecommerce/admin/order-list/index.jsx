import { useCallback, useState } from 'react';
import { Box, Button, InputAdornment, MenuItem, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useGridApiRef } from '@mui/x-data-grid';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import OrdersTable from './OrderTable';

const OrderListContainer = () => {
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const apiRef = useGridApiRef();
  const { up } = useBreakpoints();

  const upLg = up('lg');

  const handleSearch = useCallback(
    (e) => {
      apiRef.current?.setQuickFilterValues([e.target.value]);
    },
    [apiRef],
  );

  const handleToggleFilterPanel = (e) => {
    const clickedEl = e.currentTarget;

    if (filterButtonEl && filterButtonEl === clickedEl) {
      setFilterButtonEl(null);
      apiRef.current?.hideFilterPanel();

      return;
    }

    setFilterButtonEl(clickedEl);
    apiRef.current?.showFilterPanel();
  };

  return (
    <Grid container spacing={4}>
      <Grid size={12}>
        <Stack
          sx={{
            columnGap: 1,
            rowGap: 2,
            justifyContent: 'space-between',
            alignItems: { xl: 'center' },
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
          }}
        >
          <Button href={'#!'} variant="contained" color="primary" sx={{ flexShrink: 0 }}>
            Add Order
          </Button>

          <StyledTextField
            id="search-box"
            type="search"
            size="medium"
            placeholder="Search order"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconifyIcon
                      icon="material-symbols:search-rounded"
                      sx={{
                        fontSize: 20,
                        color: 'text.secondary',
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              maxWidth: { sm: 250 },
              order: { xs: 1, sm: 0 },
              flexBasis: { xs: 'calc(100% - 88px)', sm: 'auto' },
              mr: { sm: 2 },
            }}
            onChange={handleSearch}
          />

          <Box sx={{ maxWidth: { xs: 200, sm: 150 }, width: 1, ml: 'auto' }}>
            <StyledTextField variant="filled" fullWidth select defaultValue="30days">
              <MenuItem value="30days">Last 30 days</MenuItem>
              <MenuItem value="90days">Last 90 days</MenuItem>
              <MenuItem value="lastYear">Last year</MenuItem>
            </StyledTextField>
          </Box>

          <Stack spacing={1} sx={{ order: 1, ml: { md: 2 } }}>
            <Button
              variant="text"
              color="neutral"
              shape={upLg ? undefined : 'square'}
              disabled
              size={upLg ? 'medium' : undefined}
              sx={{ flexShrink: 0 }}
            >
              <IconifyIcon icon="material-symbols:star-rounded" fontSize={20} />
              {upLg && <Box component="span">Saved</Box>}
            </Button>

            <Button
              variant="text"
              sx={{ flexShrink: 0 }}
              color="neutral"
              shape={upLg ? undefined : 'square'}
              size={upLg ? 'medium' : undefined}
              onClick={handleToggleFilterPanel}
            >
              {upLg && (
                <IconifyIcon
                  icon="material-symbols:swap-vert-rounded"
                  fontSize={'20px !important'}
                />
              )}
              {!upLg && (
                <IconifyIcon
                  icon="material-symbols:filter-alt-outline"
                  fontSize={'20px !important'}
                />
              )}
              {upLg && <Box component="span">More filters</Box>}
            </Button>
          </Stack>
        </Stack>
      </Grid>

      <Grid size={12}>
        <OrdersTable apiRef={apiRef} filterButtonEl={filterButtonEl} />
      </Grid>
    </Grid>
  );
};

export default OrderListContainer;
