import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const AllocationTable = ({ tableData }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        outline: 'none',
        borderRadius: '8px 8px 0 0',
        overflow: 'hidden',
      }}
    >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow
            sx={(theme) => ({
              bgcolor: 'background.elevation2',
              [`& .${tableCellClasses.root}`]: {
                p: `${theme.spacing(2)} !important`,
                color: 'text.secondary',
                bgcolor: 'inherit',
              },
            })}
          >
            <TableCell component="th">Dept</TableCell>
            <TableCell component="th" align="right">
              Headcount
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((item) => (
            <TableRow
              key={item.department}
              sx={(theme) => ({
                borderRadius: 4,
                overflow: 'hidden',
                '&:nth-of-type(even)': { bgcolor: 'background.elevation1' },
                [`& .${tableCellClasses.root}`]: {
                  border: 'none',
                  bgcolor: 'inherit',
                  p: `${theme.spacing(2)} !important`,
                  '&:first-of-type': { borderRadius: '4px 0 0 4px' },
                  '&:last-of-type': { borderRadius: '0 4px 4px 0' },
                },
              })}
            >
              <TableCell scope="row">{item.department}</TableCell>
              <TableCell align="right">{item.headCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AllocationTable;
