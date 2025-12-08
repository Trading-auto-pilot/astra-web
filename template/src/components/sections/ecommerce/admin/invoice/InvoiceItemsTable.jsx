import { useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';

const getTotalPrice = (price, vat, quantity) => {
  const subtotal = price * quantity;
  const vatAmount = subtotal * (vat / 100);

  return subtotal + vatAmount;
};

const InvoiceItemsTable = ({ invoice }) => {
  const { items, payment } = invoice.order;
  const { currencyFormat } = useNumberFormat();
  const subTotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const subtotal = item.price.discounted * item.quantity;
      const vatAmount = subtotal * (item.vat / 100);

      return acc + subtotal + vatAmount;
    }, 0);
  }, [items]);

  return (
    <div>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
        }}
      >
        Order items
      </Typography>
      <TableContainer>
        <Table
          sx={{ minWidth: 800 }}
          stickyHeader
          aria-label="spanning table"
          className="disable-edge-padding"
        >
          <TableHead>
            <TableRow
              sx={{
                '& th': {
                  whiteSpace: 'nowrap',
                },
              }}
            >
              <TableCell>#</TableCell>
              <TableCell>Product name</TableCell>
              <TableCell sx={{ maxWidth: 130 }}>Shop SKU</TableCell>
              <TableCell>Seller SKU</TableCell>
              <TableCell>Variant</TableCell>
              <TableCell align="right">Sub Total</TableCell>
              <TableCell align="right">Vat</TableCell>
              <TableCell align="right">Total Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ minWidth: 280 }}>{item.name}</TableCell>
                <TableCell sx={{ wordBreak: 'break-word' }}>{item.shopSku}</TableCell>
                <TableCell>{item.sellerSku}</TableCell>
                <TableCell>
                  {item.variants.map((variant) => (
                    <Typography
                      key={variant.label}
                      variant="subtitle2"
                      sx={{
                        fontWeight: 400,
                        whiteSpace: 'nowrap',
                        textTransform: 'capitalize',
                      }}
                    >
                      {variant.label}: {variant.value}
                    </Typography>
                  ))}
                </TableCell>
                <TableCell align="right">
                  {currencyFormat(item.price.discounted * item.quantity)}
                </TableCell>
                <TableCell align="right" sx={{ minWidth: 130 }}>
                  {item.vat}%
                </TableCell>
                <TableCell align="right" sx={{ minWidth: 130 }}>
                  <Box component="strong">
                    {currencyFormat(getTotalPrice(item.price.discounted, item.vat, item.quantity))}
                  </Box>
                </TableCell>
              </TableRow>
            ))}

            <TableRow
              sx={{
                '& td': {
                  border: 'none',
                },
              }}
            >
              <TableCell colSpan={7} align="right">
                Subtotal
              </TableCell>
              <TableCell align="right">{currencyFormat(subTotal)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={7} align="right">
                Shipping cost
              </TableCell>
              <TableCell align="right">{currencyFormat(payment.shippingCost)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                colSpan={7}
                align="right"
                sx={{ color: (theme) => `${theme.vars.palette.text.primary} !important` }}
              >
                Total
              </TableCell>
              <TableCell align="right">
                <Box
                  component="strong"
                  sx={{
                    color: 'text.primary',
                  }}
                >
                  {currencyFormat(subTotal + payment.shippingCost)}
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default InvoiceItemsTable;
