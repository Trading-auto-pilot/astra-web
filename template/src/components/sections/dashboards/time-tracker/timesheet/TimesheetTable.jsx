import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import useNumberFormat from 'hooks/useNumberFormat';
import { getPastDates } from 'lib/utils';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import DashboardMenu from 'components/common/DashboardMenu';
import DataGridPagination from 'components/pagination/DataGridPagination';
import TableLabelDisplayedRows from 'components/pagination/TableLabelDisplayedRows';

const defaultPageSize = 6;

const getTimeRange = (type) => {
  if (type === 'last 2 weeks') {
    return getPastDates(14).map((day) => dayjs(day).format('ddd, D MMM'));
  } else if (type === 'last 30 days') {
    return getPastDates(30).map((day) => dayjs(day).format('ddd, D MMM'));
  } else {
    return getPastDates('week').map((day) => dayjs(day).format('ddd, D MMM'));
  }
};

const formatTime = (totalSeconds) => {
  const timeDuration = dayjs.duration(totalSeconds, 'seconds');
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = timeDuration.minutes().toString().padStart(2, '0');
  const seconds = timeDuration.seconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const addTimes = (times) => {
  return times.reduce((acc, curr) => curr.map((item, index) => (acc[index] || 0) + item), []);
};

const filterData = (project, filterBy) => {
  let times = [];

  if (filterBy.member) {
    times = project.workLogs.find((item) => item.user.name === filterBy.member)?.durations ?? [];
  } else if (filterBy.team) {
    const durations = project.workLogs
      .filter((item) => {
        if (item.team === filterBy.team) {
          return item;
        }
      })
      .map((item) => item.durations);

    times = addTimes(durations);
  } else {
    const durations = project.workLogs.map((item) => item.durations);
    times = addTimes(durations);
  }

  return times;
};

const TimesheetTable = ({ apiRef, filterBy, timesheet, filterButtonEl }) => {
  const { currencyFormat } = useNumberFormat();
  const timerange = getTimeRange(filterBy.timeframe);
  const { up } = useBreakpoints();
  const upLg = up('lg');

  const rows = timesheet.map((project) => {
    const times = filterData(project, filterBy).slice(-timerange.length);
    const totalTimes = times.reduce((sum, seconds) => sum + seconds, 0);

    return {
      ...project,
      totalTimes: formatTime(totalTimes),
      ...Object.fromEntries(
        timerange.map((day, index) => [day.replace(/[^a-zA-Z0-9]/g, ''), formatTime(times[index])]),
      ),
    };
  });

  const columns = useMemo(
    () => [
      {
        field: 'project',
        headerName: 'Project',
        headerClassName: 'project',
        minWidth: 260,
        flex: 1,
      },
      ...timerange.map((day) => ({
        field: day.replace(/[^a-zA-Z0-9]/g, ''),
        headerName: day,
        minWidth: 130,
        align: 'right',
        headerAlign: 'right',
        flex: 1,
      })),
      {
        field: 'totalTimes',
        headerName: 'Total',
        flex: 1,
        fontWeight: 'bold',
        align: 'right',
        headerAlign: 'right',
        minWidth: 140,
        renderCell: (params) => (
          <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
            {params.row.totalTimes}
          </Typography>
        ),
      },
      {
        field: 'action',
        headerAlign: 'right',
        align: 'right',
        editable: false,
        sortable: false,
        flex: 1,
        minWidth: 80,
        renderHeader: () => <DashboardMenu />,
        renderCell: () => <DashboardMenu />,
      },
    ],
    [currencyFormat],
  );

  return (
    <Box sx={{ width: 1 }}>
      <DataGrid
        rowHeight={64}
        rows={rows}
        apiRef={apiRef}
        columns={columns}
        pageSizeOptions={[defaultPageSize]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: defaultPageSize,
            },
          },
        }}
        slots={{
          basePagination: (props) => (
            <DataGridPagination
              showAllHref="#!"
              labelDisplayedRows={upLg ? TableLabelDisplayedRows : () => null}
              {...props}
            />
          ),
        }}
        slotProps={{
          panel: {
            target: filterButtonEl,
          },
        }}
        sx={{
          '& .project': {
            pl: 3,
          },
        }}
      />
    </Box>
  );
};

export default TimesheetTable;
