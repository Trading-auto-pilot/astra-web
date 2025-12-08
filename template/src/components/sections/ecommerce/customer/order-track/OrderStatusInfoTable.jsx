import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const OrderStatusInfoTable = ({ data }) => {
  return (
    <TableContainer component={Box} sx={{ m: 0, p: 0 }}>
      <Table sx={{ minWidth: 650 }} aria-label="order status info table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Place</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{
                '& td': {
                  fontSize: 16,
                  color: 'text.secondary',
                },
                '&:last-of-type td': { border: 0 },
              }}
            >
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.time}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.place}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default OrderStatusInfoTable;
