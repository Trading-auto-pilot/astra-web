import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Box, Chip, Link, Stack } from '@mui/material';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { productListAdmin } from 'data/e-commerce/products';
import useNumberFormat from 'hooks/useNumberFormat';
import paths from 'routes/paths';
import Image from 'components/base/Image';
import DashboardMenu from 'components/common/DashboardMenu';
import DataGridPagination from 'components/pagination/DataGridPagination';

const getStatusBadgeColor = (val) => {
  switch (val) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'neutral';
    case 'draft':
      return 'warning';
    case 'archive':
      return 'error';
    default:
      return 'primary';
  }
};

const zeroPad = (num, places) => String(num).padStart(places, '0');

const defaultPageSize = 8;

const ProductsTable = ({ apiRef, filterButtonEl }) => {
  const { currencyFormat } = useNumberFormat();
  const navigate = useNavigate();
  const columns = useMemo(
    () => [
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 64,
      },
      {
        field: 'name',
        headerName: 'Name',
        minWidth: 500,
        flex: 1,
        renderCell: (params) => {
          return (
            <Stack
              spacing={1.25}
              sx={{
                alignItems: 'center',
              }}
            >
              <Image
                src={params.row.image.src}
                alt={params.row.name}
                onClick={() => navigate(paths.productDetails(String(params.row.id)))}
                sx={{ cursor: 'pointer' }}
                height={48}
                width={48}
              />
              <Link
                href={paths.productDetails(String(params.row.id))}
                variant="subtitle2"
                sx={{ fontWeight: 400 }}
              >
                {params.row.name}
              </Link>
            </Stack>
          );
        },
      },
      {
        field: 'category',
        headerName: 'Category',
        minWidth: 148,
        renderCell: (params) => {
          return <Chip label={params.row.category} variant="soft" color="neutral" />;
        },
      },
      {
        field: 'price',
        headerName: 'Price',
        minWidth: 80,
        valueGetter: ({ discounted }) => discounted,
        renderCell: ({ row: { price } }) => currencyFormat(price.discounted),
      },
      {
        field: 'status',
        headerName: 'Status',
        minWidth: 148,
        renderCell: (params) => {
          return (
            <Chip
              label={params.row.status}
              variant="soft"
              color={getStatusBadgeColor(params.row.status)}
              sx={{ textTransform: 'capitalize' }}
            />
          );
        },
      },
      {
        field: 'stock',
        headerName: 'Inventory',
        minWidth: 108,
        renderCell: (params) => zeroPad(params.row.stock, 2),
      },
      {
        field: 'vendor',
        headerName: 'Vendor',
        minWidth: 200,
        renderCell: (params) => {
          return (
            <Link variant="subtitle2" href="#!" sx={{ fontWeight: 400 }}>
              {params.row.vendor}
            </Link>
          );
        },
      },
      {
        field: 'publishedAt',
        headerName: 'Published on',
        minWidth: 130,
        filterable: false,
        renderCell: (params) => params.row.publishedAt,
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
        rows={productListAdmin}
        apiRef={apiRef}
        columns={columns}
        pageSizeOptions={[defaultPageSize, 15]}
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

export default ProductsTable;
