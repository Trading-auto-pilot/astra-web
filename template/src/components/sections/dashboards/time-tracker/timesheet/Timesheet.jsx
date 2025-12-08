import { useState } from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import { timesheet } from 'data/time-tracker/dashboard';
import TimesheetTable from './TimesheetTable';
import Filters from './filters/Filters';

const Timesheet = () => {
  const [filterBy, setFilterBy] = useState({ timeframe: 'last 7 days' });
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const apiRef = useGridApiRef();

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

  const handleFilter = (field, filterBy) => {
    setFilterBy((prev) =>
      field === 'timeframe'
        ? { ...prev, [field]: filterBy }
        : { [field]: filterBy, timeframe: prev.timeframe },
    );
  };

  return (
    <Paper sx={{ p: { xs: 3, md: 5 }, height: 1 }}>
      <Stack sx={{ mb: 4, gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h6">Timesheet</Typography>
        <Filters
          filterBy={filterBy}
          handleFilter={handleFilter}
          handleToggleFilterPanel={handleToggleFilterPanel}
        />
      </Stack>
      <TimesheetTable
        apiRef={apiRef}
        filterBy={filterBy}
        timesheet={timesheet}
        filterButtonEl={filterButtonEl}
      />
    </Paper>
  );
};

export default Timesheet;
