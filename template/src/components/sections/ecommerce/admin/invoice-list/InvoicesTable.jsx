import { useMemo } from 'react';
import { Avatar, Box, Button, Chip, Link, Stack, Typography } from '@mui/material';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { invoiceListAdmin } from 'data/e-commerce/orders';
import useNumberFormat from 'hooks/useNumberFormat';
import IconifyIcon from 'components/base/IconifyIcon';
import DashboardMenu from 'components/common/DashboardMenu';
import DataGridPagination from 'components/pagination/DataGridPagination';

const getPaymentStatusBadgeColor = (val) => {
  switch (val) {
    case 'paid':
      return 'success';
    case 'due':
      return 'warning';
    default:
      return 'neutral';
  }
};

const defaultPageSize = 8;
const InvoicesTable = ({ apiRef }) => {
  const { currencyFormat } = useNumberFormat();
  const columns = useMemo(
    () => [
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 64,
      },
      {
        field: 'invoiceId',
        headerName: 'Invoice',
        sortable: false,
        filterable: true,
        minWidth: 208,
        flex: 1,
        renderCell: (params) => {
          return (
            <Link variant="subtitle2" sx={{ fontWeight: 400 }} href="#!">
              {params.row.invoiceId}
            </Link>
          );
        },
      },
      {
        field: 'customer',
        headerName: 'Customer',
        minWidth: 288,
        filterable: true,
        valueGetter: ({ name }) => name,
        renderCell: (params) => {
          return (
            <Stack
              sx={{
                gap: 1.5,
                alignItems: 'center',
              }}
            >
              <Avatar
                alt={params.row.customer.name}
                src={params.row.customer.avatar}
                sx={{ width: 32, height: 32 }}
              />
              <div>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 400,
                  }}
                >
                  {params.row.customer.name}
                </Typography>
                <Link href="#!" variant="caption">
                  {params.row.customer.email}
                </Link>
              </div>
            </Stack>
          );
        },
      },
      {
        field: 'customer.email',
        headerName: 'Email',
        hideable: true,
        filterable: true,
      },
      {
        field: 'id',
        headerName: 'Order',
        sortable: false,
        filterable: false,
        minWidth: 128,
        renderCell: (params) => {
          return (
            <Link variant="subtitle2" href="#!" sx={{ fontWeight: 400 }}>
              {params.row.id}
            </Link>
          );
        },
      },
      {
        field: 'date',
        headerName: 'Date',
        minWidth: 208,
        flex: 1,
      },
      {
        field: 'total',
        headerName: 'Amount',
        minWidth: 108,
        renderCell: (params) => {
          return (
            <strong>
              {currencyFormat(
                params.row.items.reduce((total, item) => {
                  return total + item.product.price.discounted * item.quantity;
                }, 0),
              )}
            </strong>
          );
        },
      },
      {
        field: 'paymentStatus',
        headerName: 'Status',
        minWidth: 152,
        flex: 1,
        renderCell: (params) => {
          return (
            <Chip
              label={params.row.paymentStatus}
              variant="soft"
              color={getPaymentStatusBadgeColor(params.row.paymentStatus)}
              sx={{ textTransform: 'capitalize' }}
            />
          );
        },
      },
      {
        field: 'action',
        headerName: 'Action',
        filterable: false,
        sortable: false,
        align: 'right',
        headerAlign: 'right',
        renderCell: () => {
          return (
            <Stack
              sx={{
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              <Button size="small" color="neutral" shape="square" sx={{ flexShrink: 0 }}>
                <IconifyIcon icon="material-symbols:download-rounded" fontSize={18} />
              </Button>
              <DashboardMenu />
            </Stack>
          );
        },
      },
    ],
    [currencyFormat],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rowHeight={64}
        rows={invoiceListAdmin}
        apiRef={apiRef}
        columns={columns}
        pageSizeOptions={[defaultPageSize]}
        columnVisibilityModel={{
          'customer.email': false,
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: defaultPageSize,
            },
          },
        }}
        checkboxSelection
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            minWidth: '100%',
          },
        }}
        slots={{
          basePagination: (props) => <DataGridPagination showFullPagination {...props} />,
        }}
      />
    </Box>
  );
};

export default InvoicesTable;
