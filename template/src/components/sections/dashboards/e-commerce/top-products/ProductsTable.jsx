import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Avatar, AvatarGroup, Chip, Link, Stack, Tooltip, avatarClasses } from '@mui/material';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { topProducts } from 'data/e-commerce/dashboard';
import useNumberFormat from 'hooks/useNumberFormat';
import paths from 'routes/paths';
import Image from 'components/base/Image';
import DashboardMenu from 'components/common/DashboardMenu';
import DataGridPagination from 'components/pagination/DataGridPagination';

const getStockBadge = (val) => {
  switch (val) {
    case 'In Stock':
      return {
        color: 'success',
        icon: 'ic:round-check',
      };
    case 'Low Stock':
      return {
        color: 'warning',
        icon: 'material-symbols:warning-outline-rounded',
      };
    case 'Stockout':
      return {
        color: 'error',
        icon: 'ic:round-do-not-disturb-alt',
      };

    default:
      return {
        color: 'primary',
        icon: 'material-symbols:check-small-rounded',
      };
  }
};

const ProductsTable = ({ apiRef }) => {
  const { currencyFormat, numberFormat } = useNumberFormat();
  const navigate = useNavigate();
  const columns = useMemo(
    () => [
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 64,
      },
      {
        field: 'product',
        headerName: 'Product',
        headerClassName: 'product-header',
        width: 300,
        valueGetter: ({ name }) => name,
        renderCell: (params) => {
          return (
            <Stack
              spacing={1.25}
              sx={{
                alignItems: 'center',
              }}
            >
              <Image
                src={params.row.product.image}
                alt={params.row.product.name}
                onClick={() => navigate(paths.productDetails(String(params.row.id)))}
                sx={{ cursor: 'pointer' }}
                height={48}
                width={48}
              />
              <Link
                href={paths.productDetails(String(params.row.id))}
                sx={{
                  color: 'text.secondary',
                }}
              >
                {params.row.product.name}
              </Link>
            </Stack>
          );
        },
      },
      {
        field: 'vendor',
        headerName: 'Vendors',
        minWidth: 150,
        flex: 0.35,
        sortable: false,
        renderCell: (params) => (
          <AvatarGroup
            max={5}
            color="primary"
            sx={{
              display: 'inline-flex',
              [`& .${avatarClasses.root}`]: {
                width: 28,
                height: 28,
                fontSize: 12.8,
                fontWeight: 'medium',
                backgroundColor: 'primary.main',
              },
            }}
          >
            {params.row.vendors.map((v) => (
              <Tooltip title={v.name} key={v.name}>
                <Avatar alt={v.name} src={v.avatar} />
              </Tooltip>
            ))}
          </AvatarGroup>
        ),
      },
      {
        field: 'margin',
        headerName: 'Margin',
        flex: 0.2,
        minWidth: 120,
        align: 'right',
        headerAlign: 'right',
        headerClassName: 'margin',
        cellClassName: 'margin',
        renderCell: (params) => currencyFormat(params.row.margin),
      },
      {
        field: 'sold',
        headerName: 'Sold',
        minWidth: 110,
        flex: 0.2,

        renderCell: (params) => numberFormat(params.row.sold),
      },
      {
        field: 'stock',
        headerName: 'Stock',
        minWidth: 120,
        flex: 0.25,
        align: 'center',
        headerAlign: 'right',
        renderCell: (params) => (
          <Chip
            label={params.row.stock}
            color={getStockBadge(params.row.stock)?.color}
            variant="soft"
            size="small"
            sx={{
              width: '100%',
              maxWidth: 118,
            }}
          />
        ),
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
    [currencyFormat, numberFormat],
  );

  return (
    <Stack direction="column" sx={{ width: '100%' }}>
      <DataGrid
        rowHeight={64}
        rows={topProducts}
        apiRef={apiRef}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 6,
            },
          },
        }}
        pageSizeOptions={[6]}
        checkboxSelection
        slots={{
          basePagination: (props) => <DataGridPagination showAllHref="#!" {...props} />,
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

export default ProductsTable;
