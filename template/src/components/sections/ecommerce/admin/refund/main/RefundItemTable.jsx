import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import NumberTextField from 'components/base/NumberTextField';
import { useOrderDetails } from '../../order/OrderDetailsProvider';

const createData = (name, orderAmount, priorRefund, maxRefund) => {
  return { name, orderAmount, priorRefund, maxRefund };
};

const RefundItemTable = ({ product, index }) => {
  const { order } = useOrderDetails();
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();
  const { currencyFormat } = useNumberFormat();

  const refunds = useWatch({
    control,
    name: 'refunds',
  });

  const totalRefund = useMemo(
    () =>
      refunds?.[index]
        ? Number(refunds[index].product + refunds[index].shipping + refunds[index].concession)
        : 0,
    [refunds],
  );

  const tableRows = useMemo(() => {
    return [
      createData(
        'product',
        product.price.discounted,
        product.priorRefunds?.product || 0,
        product.price.discounted,
      ),
      createData(
        'shipping',
        order?.payment.shippingCost || 0,
        product.priorRefunds?.shipping || 0,
        order?.payment.shippingCost || 0,
      ),
      createData(
        'concession',
        0,
        product.priorRefunds?.concession || 0,
        product.price.discounted / 2,
      ),
    ];
  }, []);

  return (
    <Paper
      background={1}
      sx={{
        borderRadius: 6,
        outline: 'none',
        p: 3,
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 720 }} aria-label="refund table" className="disable-edge-padding">
          <TableHead>
            <TableRow
              sx={{
                '& th': {
                  whiteSpace: 'nowrap',
                },
              }}
            >
              <TableCell />
              <TableCell>Order amount</TableCell>
              <TableCell>Prior refund</TableCell>
              <TableCell>Amount to refund</TableCell>
              <TableCell align="right">Refund full amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row) => (
              <TableRow key={row.name}>
                <TableCell sx={{ minWidth: 200, textTransform: 'capitalize' }}>
                  {row.name}
                </TableCell>
                <TableCell>{currencyFormat(row.orderAmount)}</TableCell>
                <TableCell>{currencyFormat(row.priorRefund)}</TableCell>
                <TableCell sx={{ minWidth: 160 }}>
                  <NumberTextField
                    variant="custom"
                    error={!!errors.refunds?.[index]?.[row.name]}
                    {...register(`refunds.${index}.${row.name}`, {
                      value: 0,
                      setValueAs: (value) => Number(value),
                    })}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      },
                    }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ minWidth: 160 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 400,
                    }}
                  >
                    Max {currencyFormat(row.maxRefund)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ '& th, & td': { border: 0 } }}>
              <TableCell>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Total
                </Typography>
              </TableCell>
              <TableCell>
                {currencyFormat(tableRows.reduce((acc, row) => acc + row.orderAmount, 0))}
              </TableCell>
              <TableCell>
                {currencyFormat(tableRows.reduce((acc, row) => acc + row.priorRefund, 0))}
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {currencyFormat(totalRefund)}
                </Typography>
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RefundItemTable;
