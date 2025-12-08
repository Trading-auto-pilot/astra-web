import { useMemo } from 'react';
import { Avatar, Box, Chip, Link, Stack, Typography } from '@mui/material';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import useNumberFormat from 'hooks/useNumberFormat';
import paths from 'routes/paths';
import DashboardMenu from 'components/common/DashboardMenu';
import DataGridPagination from 'components/pagination/DataGridPagination';

const getPaymentStatusBadgeColor = (val) => {
  switch (val) {
    case 'sent':
      return 'success';
    case 'paid':
      return 'info';
    case 'late':
      return 'error';
    default:
      return 'neutral';
  }
};

const defaultPageSize = 8;

const InvoiceListTable = ({ apiRef, data, filterButtonEl, filterModel, onFilterModelChange }) => {
  const { currencyFormat } = useNumberFormat();
  const columns = useMemo(
    () => [
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 64,
      },
      {
        field: 'id',
        headerName: 'Invoice',
        sortable: false,
        filterable: true,
        minWidth: 80,
        renderCell: (params) => {
          const { id } = params.row;

          return (
            <Link
              variant="body2"
              sx={{ fontWeight: 400 }}
              href={paths.invoicePreviewWithId(id.toString())}
            >
              #{id}
            </Link>
          );
        },
      },
      {
        field: 'client',
        headerName: 'Client',
        minWidth: 240,
        filterable: true,
        flex: 1,
        valueGetter: ({ name }) => name,
        renderCell: (params) => {
          const { name, avatar, email } = params.row.client;

          return (
            <Stack
              sx={{
                gap: 1.5,
                alignItems: 'center',
              }}
            >
              <Avatar alt={name} src={avatar} sx={{ width: 24, height: 24 }} />
              <div>
                <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
                  {name}
                </Typography>
                <Link href="#!" variant="caption">
                  {email}
                </Link>
              </div>
            </Stack>
          );
        },
      },
      {
        field: 'issueDate',
        headerName: 'Issue Date',
        valueGetter: ({ date }) => date,
        filterable: true,
        minWidth: 150,
        renderCell: (params) => {
          return (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
                {dayjs(params.row.issueDate.date).format('MMM DD, YYYY')}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {params.row.issueDate.time}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: 'status',
        headerName: 'Status',
        filterable: true,
        // valueGetter: ({ status }) => status,
        minWidth: 200,
        flex: 1,
        renderCell: (params) => {
          return (
            <Stack sx={{ alignItems: 'center', gap: 1 }}>
              <Chip
                label={params.row.status}
                variant="soft"
                color={getPaymentStatusBadgeColor(params.row.status)}
                sx={{ textTransform: 'capitalize' }}
              />
              <Typography
                variant="body2"
                color={params.row.status === 'late' ? 'error' : undefined}
                sx={{ fontWeight: 400 }}
              >
                {params.row.status === 'paid' ? 'Paid' : 'Due'} on{' '}
                {dayjs(params.row.paymentDate).format('MMM DD, YYYY')}
              </Typography>
            </Stack>
          );
        },
      },
      {
        field: 'requiredAmount',
        headerName: 'Amount',
        filterable: false,
        minWidth: 100,
        align: 'right',
        headerAlign: 'right',
        headerClassName: 'margin',
        cellClassName: 'margin',
        renderCell: (params) => {
          return (
            <Typography variant="body2" sx={{ fontWeight: 400 }}>
              {currencyFormat(params.row.requiredAmount)}
            </Typography>
          );
        },
      },
      {
        field: 'paidAmount',
        headerName: 'Paid',
        filterable: false,
        minWidth: 100,
        align: 'right',
        headerAlign: 'right',
        headerClassName: 'margin',
        cellClassName: 'margin',
        renderCell: (params) => {
          return (
            <Typography variant="body2" sx={{ fontWeight: 400 }}>
              {currencyFormat(params.row.paidAmount)}
            </Typography>
          );
        },
      },
      {
        field: 'remainingBalance',
        headerName: 'Balance',
        filterable: false,
        sortable: false,
        minWidth: 100,
        align: 'right',
        headerAlign: 'right',
        headerClassName: 'margin',
        cellClassName: 'margin',
        renderCell: (params) => {
          return (
            <Typography variant="body2" sx={{ fontWeight: 400 }}>
              {currencyFormat(params.row.requiredAmount - params.row.paidAmount)}
            </Typography>
          );
        },
      },
      {
        field: 'action',
        headerName: '',
        filterable: false,
        sortable: false,
        align: 'right',
        width: 60,
        headerAlign: 'right',
        renderCell: () => <DashboardMenu />,
      },
    ],
    [currencyFormat],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rowHeight={72}
        rows={data}
        apiRef={apiRef}
        columns={columns}
        pageSizeOptions={[defaultPageSize]}
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: defaultPageSize,
            },
          },
        }}
        checkboxSelection
        sx={{
          '& .margin': {
            pr: 3,
          },
          '& .MuiDataGrid-columnHeaders': {
            minWidth: '100%',
          },
        }}
        slots={{
          basePagination: (props) => <DataGridPagination showFullPagination {...props} />,
        }}
        slotProps={{
          panel: {
            target: filterButtonEl,
          },
        }}
      />
    </Box>
  );
};

export default InvoiceListTable;
