import { useMemo } from 'react';
import {
  Box,
  Chip,
  Grid,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import Image from 'components/base/Image';
import RecipientCard from '../create-invoice/invoice-details/RecipientCard';

const getTotalPrice = (subtotal, vat, discount, shippingCost) => {
  const taxableAmount = subtotal - discount;
  const taxAmount = taxableAmount * (vat / 100);

  return taxableAmount + taxAmount + shippingCost;
};

const InvoiceTable = ({ invoice }) => {
  const { currencyFormat } = useNumberFormat();
  const { itemDetails } = invoice;
  const subTotal = useMemo(() => {
    return itemDetails.reduce((acc, item) => {
      const itemPriceCents = Math.round((item.price || 0) * 100);
      const lineTotal = (itemPriceCents * (item.quantity || 0)) / 100;

      return acc + lineTotal;
    }, 0);
  }, [itemDetails]);

  return (
    <>
      <Stack
        sx={{ justifyContent: 'space-between', alignItems: { md: 'flex-end' }, gap: 2, mb: 4 }}
      >
        <Image src={invoice.organizationImage?.file} alt="logo" width={144} height={72} />
        <Box sx={{ textAlign: 'end' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Amount: {currencyFormat(invoice.invoiceDetails.amount)}
          </Typography>
          <Chip
            variant="soft"
            color="success"
            label={
              <Typography variant="subtitle2" component="span">
                {invoice.invoiceDetails.status}
              </Typography>
            }
          />
        </Box>
      </Stack>
      <Paper
        variant="elevation"
        elevation={0}
        background={1}
        sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, outline: 0, mb: 2 }}
      >
        <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
          <Grid size={{ xs: 6 }}>
            <RecipientCard
              title="Invoice form"
              data={invoice.invoiceFrom}
              editButton={false}
              sxProps={{ color: 'text.secondary' }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <RecipientCard
              title="Invoice To"
              data={invoice.invoiceTo}
              editButton={false}
              sxProps={{ color: 'text.secondary' }}
            />
          </Grid>
        </Grid>
      </Paper>

      <TableContainer
        sx={{
          mb: 4,
        }}
      >
        <Table sx={{ minWidth: 800 }} stickyHeader aria-label="spanning table">
          <TableHead>
            <TableRow
              sx={{
                '& th': {
                  whiteSpace: 'nowrap',
                },
                '& th:first-of-type': {
                  paddingLeft: '16px',
                },
                '& th:last-of-type': {
                  paddingRight: '16px',
                },
              }}
            >
              <TableCell>Item type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              '& tr td:first-of-type': {
                paddingLeft: '16px',
              },
              '& tr td:last-of-type': {
                paddingRight: '16px',
              },
            }}
          >
            {itemDetails.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ width: 140, textTransform: 'capitalize' }}>{item.type}</TableCell>
                <TableCell sx={{ wordBreak: 'break-word', width: 376 }}>
                  {item.description}
                </TableCell>
                <TableCell align="right" sx={{ width: 104 }}>
                  {String(item.quantity).padStart(2, '0')}
                </TableCell>
                <TableCell align="right" sx={{ width: 104 }}>
                  {currencyFormat(item.price)}
                </TableCell>
                <TableCell align="right" sx={{ width: 104 }}>
                  {currencyFormat(
                    (Math.round((item.price || 0) * 100) * (item.quantity || 0)) / 100,
                  )}
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
              <TableCell colSpan={4} align="right">
                Subtotal
              </TableCell>
              <TableCell align="right">{currencyFormat(subTotal)}</TableCell>
            </TableRow>

            <TableRow
              sx={{
                '& td': {
                  border: 'none',
                  py: '13px !important',
                },
              }}
            >
              <TableCell align="right" colSpan={4}>
                <Typography color="error" variant="body2">
                  Discount
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography
                  color="error"
                  // align="right"
                  variant="subtitle2"
                  sx={{ fontWeight: 400 }}
                >
                  -{currencyFormat(invoice.discount)}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow
              sx={{
                '& td': {
                  border: 'none',
                  py: '13px !important',
                },
              }}
            >
              <TableCell align="right" colSpan={4}>
                <Typography variant="body2">Tax</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
                  {currencyFormat(invoice.tax)}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow
              sx={{
                '& td': {
                  py: '13px !important',
                },
              }}
            >
              <TableCell align="right" colSpan={4}>
                <Typography variant="body2">Shipping cost</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
                  {currencyFormat(invoice.shippingCost)}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow
              sx={{
                '& td': {
                  py: '13px !important',
                },
              }}
            >
              <TableCell align="right" colSpan={4}>
                <Typography variant="body2">Total amount</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 700 }}>
                  {currencyFormat(
                    getTotalPrice(
                      subTotal,
                      Number(invoice.tax),
                      Number(invoice.discount),
                      Number(invoice.shippingCost),
                    ),
                  )}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="column" sx={{ gap: 1, mb: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Notes
        </Typography>
        <Typography variant="body2">{invoice.note}</Typography>
      </Stack>
      <Paper variant="elevation" elevation={0} background={1} sx={{ py: 1, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Creating with{' '}
          <Typography component="span" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            Aurora{' '}
          </Typography>
          | 2025 &copy; <Link href="https://themewagon.com/">ThemeWagon</Link>
        </Typography>
      </Paper>
    </>
  );
};

export default InvoiceTable;
