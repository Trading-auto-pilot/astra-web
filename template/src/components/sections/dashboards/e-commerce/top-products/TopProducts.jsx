import { useCallback } from 'react';
import { InputAdornment, Paper } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import IconifyIcon from 'components/base/IconifyIcon';
import DashboardMenu from 'components/common/DashboardMenu';
import SectionHeader from 'components/common/SectionHeader';
import StyledTextField from 'components/styled/StyledTextField';
import ProductsTable from './ProductsTable';

const TopProducts = () => {
  const apiRef = useGridApiRef();

  const handleSearch = useCallback(
    (e) => {
      apiRef.current?.setQuickFilterValues([e.target.value]);
    },
    [apiRef],
  );

  return (
    <Paper sx={{ px: { xs: 3, md: 5 }, py: { xs: 3, md: 5 }, height: '100%' }}>
      <SectionHeader
        title="Top products"
        subTitle="Detailed information about the products"
        sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' }, columnGap: 1, rowGap: 3, mb: 3 }}
        actionComponent={
          <>
            <StyledTextField
              id="search-box"
              type="search"
              placeholder="Search"
              size="small"
              sx={() => ({
                maxWidth: { sm: 180, md: 260 },
                width: 1,
                ml: 'auto',
                order: { xs: 1, sm: 0 },
                flexBasis: { xs: '100%' },
              })}
              onChange={handleSearch}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:search-rounded" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <DashboardMenu size="small" />
          </>
        }
      />
      <ProductsTable apiRef={apiRef} />
    </Paper>
  );
};

export default TopProducts;
