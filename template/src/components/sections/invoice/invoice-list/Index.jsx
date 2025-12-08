import { useCallback, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, InputAdornment, Stack, Tab } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import { invoiceListTableRowData } from 'data/invoice';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import InvoiceListTable from './InvoiceListTable';

const InvoiceListContainer = () => {
  const { up } = useBreakpoints();
  const upMd = up('md');
  const apiRef = useGridApiRef();

  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [value, setValue] = useState('all');
  const [filterModel, setFilterMode] = useState({
    items: [],
  });

  const handleChange = (e, newValue) => {
    setValue(newValue);
    if (newValue === 'all') {
      setFilterMode({ items: [] });
    } else {
      setFilterMode({
        items: [{ field: 'status', operator: 'equals', value: newValue }],
      });
    }
  };

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
    <TabContext value={value}>
      <Stack
        sx={{
          gap: 2,
          mb: 4,
          alignItems: { md: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box sx={{ order: { xs: 1, sm: 0 } }}>
          <Stack
            sx={{
              justifyContent: 'space-between',
            }}
          >
            <TabList onChange={handleChange} aria-label="invoice list tab">
              <Tab label="All Invoice" value="all" />
              <Tab label="Paid" value="paid" />
              <Tab label="Late" value="late" />
              <Tab label="Sent" value="sent" />
              <Tab label="Draft" value="draft" />
            </TabList>
          </Stack>
        </Box>
        <Stack sx={{ gap: 1 }}>
          <Button
            shape={upMd ? undefined : 'square'}
            variant="soft"
            color="neutral"
            onClick={handleToggleFilterPanel}
            sx={{ flexShrink: 0 }}
          >
            <IconifyIcon
              icon="mdi:filter-variant"
              sx={{
                fontSize: 20,
                marginRight: { xs: 0, md: '4px' },
              }}
            />
            {upMd && <Box component="span">Filter</Box>}
          </Button>
          <StyledTextField
            id="search-box"
            type="search"
            fullWidth
            onChange={handleSearch}
            placeholder="Search invoice"
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
              maxWidth: { sm: 200, md: 240 },
              flexGrow: { xs: 1, sm: 0 },
            }}
          />
        </Stack>
      </Stack>
      {['all', 'paid', 'late', 'sent', 'draft'].map((item) => (
        <TabPanel
          key={item}
          value={item}
          sx={{
            p: 0,
          }}
        >
          <InvoiceListTable
            data={invoiceListTableRowData}
            filterModel={filterModel}
            onFilterModelChange={setFilterMode}
            apiRef={apiRef}
            filterButtonEl={filterButtonEl}
          />
        </TabPanel>
      ))}
    </TabContext>
  );
};

export default InvoiceListContainer;
