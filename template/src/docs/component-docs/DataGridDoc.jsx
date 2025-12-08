import { Link, Typography } from '@mui/material';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { folderBaseLink, muiComponentXLink } from 'lib/constants';
import Code from 'components/base/Code';
import DashboardMenu from 'components/common/DashboardMenu';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicDataGridCode = `import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';

const columns = [
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    width: 64,
  },
  { field: 'id', headerName: 'ID', width: 70, flex:1 },
  { field: 'firstName', headerName: 'First name', minWidth: 130, flex:1 },
  { field: 'lastName', headerName: 'Last name', minWidth: 130, flex:1 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    minWidth: 80,
    flex: 0.25,
    align: 'left',
    headerAlign: 'left',
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    minWidth: 180,
    flex: 1,
    valueGetter: (value, row) => \`\${row.firstName || ''} \${row.lastName || ''}\`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const defaultPageSize = 5;

const BasicDataGrid = () => {
  return (
    <Box sx={{ width: 1}}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: defaultPageSize,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
      />
    </Box>
  );
};
render(<BasicDataGrid />)`;

const customDataGridCode = `import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';

const columns = [
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    width: 64,
  },
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', minWidth: 170, flex: 1, editable: true },
  { field: 'email', headerName: 'Email', minWidth: 230, flex: 1, editable: true },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'status',
    headerName: 'Status',
    sortable: false,
    width: 120,
    renderCell: (params) => {
      const status = params.row.status;
      switch (status) {
        case 'Online':
          return <Chip label={status} color="success" />;
        case 'Away':
          return <Chip label={status} color="warning" />;
        case 'Busy':
          return <Chip label={status} color="error" />;
      }
    },
  },
  {
    field: 'rating',
    headerName: 'Rating',
    sortable: false,
    width: 140,
    renderCell: (params) => {
      const rating = params.row.rating;
      return <Rating value={rating} precision={0.1} readOnly />;
    },
  },
  {
    field: 'action',
    headerName: '',
    filterable: false,
    sortable: false,
    width: 70,
    align: 'right',
    headerAlign: 'right',
    renderCell: () => <DashboardMenu />,
  },
];

const rows = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 28,
    status: 'Online',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    age: 34,
    status: 'Away',
    rating: 3.8,
  },
  {
    id: 3,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    age: 22,
    status: 'Busy',
    rating: 4.0,
  },
  {
    id: 4,
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    age: 45,
    status: 'Online',
    rating: 4.7,
  },
  {
    id: 5,
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    age: 31,
    status: 'Away',
    rating: 3.9,
  },
  {
    id: 6,
    name: 'Diana White',
    email: 'diana.white@example.com',
    age: 27,
    status: 'Busy',
    rating: 4.3,
  },
  {
    id: 7,
    name: 'Eve Wilson',
    email: 'eve.wilson@example.com',
    age: 30,
    status: 'Online',
    rating: 4.1,
  },
  {
    id: 8,
    name: 'Frank Green',
    email: 'frank.green@example.com',
    age: 39,
    status: 'Away',
    rating: 3.7,
  },
  {
    id: 9,
    name: 'Grace Lee',
    email: 'grace.lee@example.com',
    age: 25,
    status: 'Busy',
    rating: 4.2,
  },
  {
    id: 10,
    name: 'Henry Harris',
    email: 'henry.harris@example.com',
    age: 42,
    status: 'Online',
    rating: 4.8,
  },
  {
    id: 11,
    name: 'Isabel Martin',
    email: 'isabel.martin@example.com',
    age: 29,
    status: 'Away',
    rating: 4.0,
  },
  {
    id: 12,
    name: 'Jack Clark',
    email: 'jack.clark@example.com',
    age: 38,
    status: 'Busy',
    rating: 3.6,
  },
  {
    id: 13,
    name: 'Karen Walker',
    email: 'karen.walker@example.com',
    age: 26,
    status: 'Online',
    rating: 4.5,
  },
  {
    id: 14,
    name: 'Leo Young',
    email: 'leo.young@example.com',
    age: 33,
    status: 'Away',
    rating: 3.9,
  },
  { id: 15, name: 'Mia King', email: 'mia.king@example.com', age: 21, status: 'Busy', rating: 4.1 },
  {
    id: 16,
    name: 'Noah Scott',
    email: 'noah.scott@example.com',
    age: 37,
    status: 'Online',
    rating: 4.6,
  },
  {
    id: 17,
    name: 'Olivia Adams',
    email: 'olivia.adams@example.com',
    age: 24,
    status: 'Away',
    rating: 4.3,
  },
  {
    id: 18,
    name: 'Paul Baker',
    email: 'paul.baker@example.com',
    age: 44,
    status: 'Busy',
    rating: 4.7,
  },
  {
    id: 19,
    name: 'Quinn Roberts',
    email: 'quinn.roberts@example.com',
    age: 35,
    status: 'Online',
    rating: 4.4,
  },
  {
    id: 20,
    name: 'Rachel Evans',
    email: 'rachel.evans@example.com',
    age: 32,
    status: 'Away',
    rating: 3.8,
  },
];

const defaultPageSize = 5;

const CustomDataGrid = () => {
  return (
    <Box sx={{ width: 1 }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        editMode="row"
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: defaultPageSize,
            },
          },
        }}
        showToolbar
        pageSizeOptions={[5]}
        checkboxSelection
        sx={{
          borderColor: 'divider',
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  );
}
render(<CustomDataGrid />);`;

const DataGridDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Data Grid',
        description:
          "A fast and extendable React data table and React data grid. It's a feature-rich component available with MIT or commercial licenses.",
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'DataGrid',
          },
        ],
        docLink: `${muiComponentXLink}/react-data-grid`,
        folderLink: `${folderBaseLink}/ButtonDoc.jsx`,
      }}
    >
      <DocSection
        title="Basic Data Grid"
        descriptionEl={
          <>
            <Typography
              variant="body1"
              sx={{
                mb: 5,
              }}
            >
              The{' '}
              <Link href="https://mui.com/x/react-data-grid" target="_blank">
                <Code>DataGrid</Code> component
              </Link>{' '}
              is designed for use-cases that are focused on handling large amounts of tabular data.
            </Typography>
          </>
        }
      >
        <DocCard
          code={basicDataGridCode}
          noInline
          scope={{ DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF }}
        />
      </DocSection>
      <DocSection
        title="Custom Data Grid"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Custom Data Grid with column selection, column filtering, density selection, quick
            filtering and data exporting features using <Code>GridToolbar</Code> slot.
          </Typography>
        }
      >
        <DocCard
          code={customDataGridCode}
          noInline
          scope={{ DataGrid, DashboardMenu, GRID_CHECKBOX_SELECTION_COL_DEF }}
        />
      </DocSection>
    </DocPageLayout>
  );
};

export default DataGridDoc;
