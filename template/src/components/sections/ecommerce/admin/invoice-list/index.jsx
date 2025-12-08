import { useCallback } from 'react';
import { Button, InputAdornment, Stack } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import DateRangePicker from 'components/base/DateRangePicker';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import InvoicesTable from './InvoicesTable';

const InvoiceListContainer = () => {
  const apiRef = useGridApiRef();
  const { only } = useBreakpoints();

  const onlyXs = only('xs');

  const handleSearch = useCallback(
    (e) => {
      apiRef.current?.setQuickFilterValues([e.target.value]);
    },
    [apiRef],
  );

  return (
    <>
      <Stack
        sx={{
          gap: 1,
          mb: 4,
          alignItems: { sm: 'center' },
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ flexShrink: 0 }}
          startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}
        >
          {!onlyXs ? 'Generate new invoice' : 'New'}
        </Button>

        <StyledTextField
          id="search-box"
          type="search"
          fullWidth
          onChange={handleSearch}
          placeholder="Search"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="material-symbols:search-rounded" fontSize={20} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: { xs: 1, sm: 300 },
            flexBasis: { xs: '100%', sm: 'unset' },
            order: { xs: 1, sm: 0 },
          }}
        />

        <DateRangePicker
          sx={{ ml: 'auto', minWidth: { md: 240, lg: 300 } }}
          onChange={(date) => console.log(date)}
          placeholderText="Date Range"
          customInput={
            <StyledTextField
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon
                        icon="material-symbols:calendar-today-outline"
                        color="text.secondary"
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          }
        />
      </Stack>

      <InvoicesTable apiRef={apiRef} />
    </>
  );
};

export default InvoiceListContainer;
