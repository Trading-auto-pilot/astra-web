import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableRowClasses,
} from '@mui/material';

const getChipColor = (val) => {
  return val >= 4 ? 'success' : val >= 2 ? 'error' : 'warning';
};

const SaleFunnelTable = ({ data }) => {
  return (
    <TableContainer
      sx={{
        ml: 0,
        pl: 0,
        maxHeight: { xs: 1, sm: 254, xl: 1 },
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      <Table
        sx={{
          [`& .${tableRowClasses.root}`]: {
            '& td, & th': {
              '&:last-of-type': { pr: 1 },
            },
          },
        }}
      >
        <TableHead
          sx={{
            bgcolor: 'background.elevation2',
            '& th': {
              py: 1,
              typography: 'body2',
              fontWeight: 700,
              color: 'text.secondary',
            },
          }}
        >
          <TableRow>
            <TableCell sx={{ p: '0 !important', width: 32 }} />
            <TableCell sx={{ pl: 0 }}>Stage</TableCell>
            <TableCell align="right">Lost lead</TableCell>
            <TableCell align="right">This month</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.stage} sx={{ '&:last-of-type td': { border: 0 } }}>
              <TableCell
                sx={{
                  p: '0 !important',
                }}
              >
                <Box
                  sx={{ height: 21, width: 8, borderRadius: 0.5, bgcolor: row.stageIndicator }}
                />
              </TableCell>
              <TableCell
                scope="row"
                sx={{
                  pl: '0 !important',
                  fontWeight: 500,
                }}
              >
                {row.stage}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 500 }}>
                {row.lostLead}%
              </TableCell>
              <TableCell align="right">
                <Chip label={`${row.thisMonth}%`} color={getChipColor(row.thisMonth)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SaleFunnelTable;
