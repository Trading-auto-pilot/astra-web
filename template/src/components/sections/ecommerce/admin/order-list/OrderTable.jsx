import { useMemo } from 'react';
import { Avatar, Box, Chip, Link, Stack } from '@mui/material';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { orderListAdmin } from 'data/e-commerce/orders';
import useNumberFormat from 'hooks/useNumberFormat';
import DashboardMenu from 'components/common/DashboardMenu';
import DataGridPagination from 'components/pagination/DataGridPagination';
import OrderDetailsPopper from './OrderDetailsPopper';

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
const getFulfillmentStatusBadgeColor = (val) => {
  switch (val) {
    case 'fulfilled':
      return 'success';
    case 'partially fulfilled':
      return 'warning';
    default:
      return 'neutral';
  }
};
const getShippingMethodBadgeColor = (val) => {
  switch (val) {
    case 'standard':
      return 'primary';
    case 'express':
      return 'warning';
    default:
      return 'neutral';
  }
};

const defaultPageSize = 8;

const OrdersTable = ({ apiRef, filterButtonEl }) => {
  const { currencyFormat } = useNumberFormat();

  const columns = useMemo(
    () => [
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 64,
      },
      {
        field: 'id',
        headerName: 'Order',
        sortable: false,
        filterable: false,
        minWidth: 144,
        renderCell: (params) => {
          return <OrderDetailsPopper params={params} />;
        },
      },
      {
        field: 'date',
        headerName: 'Date',
        width: 240,
      },
      {
        field: 'customer',
        headerName: 'Customer',
        minWidth: 280,
        flex: 1,
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
              <Link variant="subtitle2" href="#!" sx={{ fontWeight: 400 }}>
                {params.row.customer.name}
              </Link>
            </Stack>
          );
        },
      },
      {
        field: 'paymentStatus',
        headerName: 'Payment status',
        minWidth: 152,
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
        field: 'fulfillmentStatus',
        headerName: 'Fulfillment status',
        minWidth: 192,
        renderCell: (params) => {
          return (
            <Chip
              label={params.row.fulfillmentStatus}
              variant="soft"
              color={getFulfillmentStatusBadgeColor(params.row.fulfillmentStatus)}
              sx={{ textTransform: 'capitalize' }}
            />
          );
        },
      },
      {
        field: 'shippingMethod',
        headerName: 'Shipping method',
        minWidth: 152,
        flex: 1,
        renderCell: (params) => {
          return (
            <Chip
              label={params.row.shippingMethod}
              variant="soft"
              color={getShippingMethodBadgeColor(params.row.shippingMethod)}
              sx={{ textTransform: 'capitalize' }}
            />
          );
        },
      },
      {
        field: 'total',
        headerName: 'Total',
        minWidth: 148,
        renderCell: (params) => {
          return (
            <strong>
              {currencyFormat(
                params.row.items.reduce((total, item) => {
                  return total + item.product?.price.discounted * item.quantity;
                }, 0),
              )}
            </strong>
          );
        },
      },
      {
        field: 'action',
        headerName: '',
        filterable: false,
        sortable: false,
        width: 60,
        align: 'right',
        headerAlign: 'right',
        renderCell: () => <DashboardMenu />,
      },
    ],
    [currencyFormat],
  );

  return (
    <Box sx={{ width: 1 }}>
      <DataGrid
        rowHeight={64}
        rows={orderListAdmin}
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
        checkboxSelection
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

export default OrdersTable;
