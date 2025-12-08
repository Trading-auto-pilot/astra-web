import { useMemo } from 'react';
import { Link } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid/colDef';
import DashboardMenu from 'components/common/DashboardMenu';
import DataGridPagination from 'components/pagination/DataGridPagination';

const PipelineTable = ({ apiRef, data }) => {
  const columns = useMemo(
    () => [
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 64,
      },
      {
        field: 'jobPosition',
        headerName: 'Job Positions',
        valueGetter: ({ title }) => title,
        minWidth: 250,
        renderCell: (params) => {
          return (
            <Stack direction="column" gap={0.5}>
              <Link href="#!" variant="subtitle2" fontWeight={600} sx={{ color: 'inherit' }}>
                {params.row.jobPosition.title}
              </Link>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {params.row.jobPosition.field}
              </Typography>
            </Stack>
          );
        },
      },
      {
        field: 'vacancy',
        headerName: 'Vacancy',
        valueGetter: ({ vacancy }) => vacancy,
        minWidth: 90,
        renderCell: (params) => {
          const vacancy = params.row.vacancy;
          let vacancyStr = vacancy.toString();
          if (vacancy < 10) vacancyStr = `0${vacancy.toString()}`;

          return <Typography variant="subtitle2">{vacancyStr}</Typography>;
        },
      },
      {
        field: 'hiringManager',
        headerName: 'Hiring Manager',
        minWidth: 190,
        renderCell: (params) => {
          return (
            <Stack gap={1.5} alignItems="center">
              <Avatar
                src={params.row.hiringManager.avatar}
                alt={params.row.hiringManager.name}
                sx={{ width: 24, height: 24 }}
              />
              <Link href="#!" variant="subtitle2" fontWeight={400} sx={{ color: 'text.secondary' }}>
                {params.row.hiringManager.name}
              </Link>
            </Stack>
          );
        },
      },
      {
        field: 'applied',
        headerName: 'Applied',
        minWidth: 125,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          return (
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={({ vars }) => ({
                width: 1,
                py: 1.5,
                borderRadius: 4,
                bgcolor: vars.palette.chGrey[50],
              })}
            >
              <Typography variant="body2" color="text.secondary">
                {params.row.applied || '_'}
              </Typography>
            </Stack>
          );
        },
      },
      {
        field: 'reviewed',
        headerName: 'Reviewed',
        minWidth: 125,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          return (
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={({ vars }) => ({
                width: 1,
                py: 1.5,
                borderRadius: 4,
                bgcolor: vars.palette.chGrey[100],
              })}
            >
              <Typography variant="body2" color="text.secondary">
                {params.row.reviewed || '_'}
              </Typography>
            </Stack>
          );
        },
      },
      {
        field: 'mobileScreen',
        headerName: 'Mobile Screen',
        minWidth: 125,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          return (
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={({ vars }) => ({
                width: 1,
                py: 1.5,
                borderRadius: 4,
                bgcolor: vars.palette.chBlue[50],
              })}
            >
              <Typography variant="body2" color="text.secondary">
                {params.row.mobileScreen || '_'}
              </Typography>
            </Stack>
          );
        },
      },
      {
        field: 'interview',
        headerName: 'Interview',
        minWidth: 125,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          return (
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={({ vars }) => ({
                width: 1,
                py: 1.5,
                borderRadius: 4,
                bgcolor: vars.palette.chBlue[100],
              })}
            >
              <Typography variant="body2" color="text.secondary">
                {params.row.interview || '_'}
              </Typography>
            </Stack>
          );
        },
      },
      {
        field: 'offer',
        headerName: 'Offer',
        minWidth: 125,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          return (
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={({ vars }) => ({
                width: 1,
                py: 1.5,
                borderRadius: 4,
                bgcolor: vars.palette.chLightBlue[50],
              })}
            >
              <Typography variant="body2" color="text.secondary">
                {params.row.offer || '_'}
              </Typography>
            </Stack>
          );
        },
      },
      {
        field: 'hired',
        headerName: 'Hired',
        minWidth: 125,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          return (
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={({ vars }) => ({
                width: 1,
                py: 1.5,
                borderRadius: 4,
                bgcolor: vars.palette.chGreen[100],
              })}
            >
              <Typography variant="body2" color="text.secondary">
                {params.row.offer || '_'}
              </Typography>
            </Stack>
          );
        },
      },
      {
        field: 'rejected',
        headerName: 'Rejected',
        minWidth: 125,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          return (
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={({ vars }) => ({
                width: 1,
                py: 1.5,
                borderRadius: 4,
                bgcolor: vars.palette.chRed[100],
              })}
            >
              <Typography variant="body2" color="text.secondary">
                {params.row.rejected || '_'}
              </Typography>
            </Stack>
          );
        },
      },
      {
        field: 'action',
        headerName: '',
        sortable: false,
        width: 60,
        align: 'right',
        headerAlign: 'right',
        renderCell: () => <DashboardMenu />,
      },
    ],
    [],
  );

  return (
    <Stack direction="column" sx={{ width: '100%' }}>
      <DataGrid
        rowHeight={64}
        rows={data}
        apiRef={apiRef}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 7,
            },
          },
        }}
        pageSizeOptions={[7]}
        checkboxSelection
        slots={{
          basePagination: (props) => (
            <DataGridPagination showFullPagination showAllHref="#!" {...props} />
          ),
        }}
        sx={{
          '& .margin': {
            pr: 5,
          },
        }}
      />
    </Stack>
  );
};

export default PipelineTable;
