import { useCallback, useState } from 'react';
import { Button, InputAdornment, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useGridApiRef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import ProductsTable from './ProductsTable';
import FilterSection from './filters/FilterSection';

const ProductListContainer = () => {
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const apiRef = useGridApiRef();

  const handleSearch = useCallback(
    (e) => {
      apiRef.current?.setQuickFilterValues([e.target.value]);
    },
    [apiRef],
  );

  const handleDateSearch = useCallback(
    (newValue) => {
      if (newValue) {
        const formattedDate = newValue.format('D MMM, YY');
        apiRef.current?.setQuickFilterValues([formattedDate]);
      } else {
        apiRef.current?.setQuickFilterValues([]);
      }
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
    <Grid container spacing={{ xs: 2, md: 4 }}>
      <Grid size={12}>
        <Stack
          direction={{ xs: 'column', xl: 'row' }}
          sx={{
            columnGap: 1,
            rowGap: 2,
            justifyContent: 'space-between',
          }}
        >
          <Stack
            spacing={1}
            sx={{ flexGrow: 1, alignItems: 'center', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
          >
            <Button
              href={paths.adminProductListing}
              variant="contained"
              color="primary"
              sx={{ flexShrink: 0 }}
            >
              Add product
            </Button>

            <StyledTextField
              id="search-box"
              type="search"
              fullWidth
              placeholder="Search product"
              onChange={handleSearch}
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
                maxWidth: {
                  sm: 360,
                  xl: 220,
                },
                mr: { sm: 4, md: 11, lg: 0 },
                order: { xs: 1, sm: 0 },
              }}
            />
            <DatePicker
              value={dayjs('2024-02-14')}
              format="D MMM, YY"
              onChange={handleDateSearch}
              slots={{
                textField: StyledTextField,
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: { maxWidth: 180, ml: { xs: 'auto', xl: 'unset' } },
                },
                field: { clearable: true },
                inputAdornment: {
                  position: 'start',
                },
              }}
              sx={{ ml: { xs: 'auto', xl: 0 } }}
            />
          </Stack>

          <FilterSection apiRef={apiRef} handleToggleFilterPanel={handleToggleFilterPanel} />
        </Stack>
      </Grid>
      <Grid size={12}>
        <ProductsTable apiRef={apiRef} filterButtonEl={filterButtonEl} />
      </Grid>
    </Grid>
  );
};

export default ProductListContainer;
