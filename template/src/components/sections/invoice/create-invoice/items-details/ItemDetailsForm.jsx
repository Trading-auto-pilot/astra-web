import { useMemo } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import {
  Button,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { currencyFormat } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import SortableDnd from 'components/base/SortableDnd';
import TableRowForm from './TableRowForm';

const getTotalPrice = (subtotal, vat, discount, shippingCost) => {
  const taxableAmount = subtotal - discount;
  const taxAmount = taxableAmount * (vat / 100);

  return taxableAmount + taxAmount + shippingCost;
};

const ItemDetailsTableForm = () => {
  const { control, watch } = useFormContext();
  const { fields, move, remove, append } = useFieldArray({
    control,
    name: 'itemDetails',
  });

  const itemDetails = useWatch({
    control,
    name: 'itemDetails',
  });
  const adjustments = watch('adjustment');
  const orderCharges = watch('orderCharges');

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((column) => column.id === active.id);
      const newIndex = fields.findIndex((column) => column.id === over?.id);
      move(oldIndex, newIndex);
    }
  };
  const subTotal = useMemo(
    () =>
      itemDetails.reduce((acc, item) => {
        const itemPriceCents = Math.round((item.price || 0) * 100);
        const itemTotal = (itemPriceCents * (item.quantity || 0)) / 100;

        return acc + itemTotal;
      }, 0),
    [itemDetails],
  );

  return (
    <Stack direction="column">
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
        Item details
      </Typography>
      <SortableDnd items={fields} onDragEnd={handleDragEnd}>
        <TableContainer sx={{ mb: 2 }}>
          <Table sx={{ minWidth: 700 }} aria-label="item details table">
            <TableHead>
              <TableRow
                sx={{
                  '& th': {
                    whiteSpace: 'nowrap',
                  },
                  '& th:first-of-type': {
                    paddingLeft: '4px',
                  },
                }}
              >
                <TableCell></TableCell>
                <TableCell>Item type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Unit price</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& tr td': {
                  padding: '20px 16px 20px 0px',
                },
                '& tr td:first-of-type': {
                  paddingLeft: 0,
                },
                '& tr td:last-of-type': {
                  paddingRight: 0,
                },
              }}
            >
              {fields.map((field, index) => (
                <TableRowForm key={field.id} index={index} field={fields[index]} remove={remove} />
              ))}
              <TableRow>
                <TableCell colSpan={7} sx={{ py: '9px !important' }}>
                  <Button
                    variant="text"
                    color="primary"
                    startIcon={<IconifyIcon icon={'material-symbols:add-circle-rounded'} />}
                    onClick={() => {
                      append({
                        type: 'service',
                        description: '',
                        quantity: 0,
                        price: 0,
                      });
                    }}
                    sx={{
                      paddingLeft: '5px',
                    }}
                  >
                    <Typography variant="button">Add Item</Typography>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Stack sx={{ py: '13px', textAlign: 'end', alignItems: 'center' }}>
          <Typography color="text.secondary" variant="body2" sx={{ flexGrow: 1 }}>
            Subtotal
          </Typography>
          <Typography
            color="text.secondary"
            variant="subtitle2"
            sx={{ fontWeight: 400, width: 130 }}
          >
            {currencyFormat(subTotal)}
          </Typography>
        </Stack>
        <Stack sx={{ py: '13px', textAlign: 'end', alignItems: 'center' }}>
          <Typography color="error.main" variant="body2" sx={{ flexGrow: 1 }}>
            Discount
          </Typography>
          <Typography color="error.main" variant="subtitle2" sx={{ fontWeight: 400, width: 130 }}>
            -{currencyFormat((adjustments.discount && adjustments.discount) || 0)}
          </Typography>
        </Stack>
        <Stack sx={{ py: '13px', textAlign: 'end', alignItems: 'center' }}>
          <Typography color="text.secondary" variant="body2" sx={{ flexGrow: 1 }}>
            Tax
          </Typography>
          <Typography
            color="text.secondary"
            variant="subtitle2"
            sx={{ fontWeight: 400, width: 130 }}
          >
            {currencyFormat((adjustments.tax && adjustments.tax) || 0)}
          </Typography>
        </Stack>
        <Stack sx={{ py: '13px', textAlign: 'end', alignItems: 'center' }}>
          <Typography color="text.secondary" variant="body2" sx={{ flexGrow: 1 }}>
            Shipping cost
          </Typography>
          <Typography
            color="text.secondary"
            variant="subtitle2"
            sx={{ fontWeight: 400, width: 130 }}
          >
            {currencyFormat((orderCharges.shippingCost && orderCharges.shippingCost) || 0)}
          </Typography>
        </Stack>
        <Divider />
        <Stack sx={{ py: '17px', textAlign: 'end', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            Total
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, width: 130 }}>
            {currencyFormat(
              getTotalPrice(
                subTotal,
                Number(adjustments.tax),
                Number(adjustments.discount),
                Number(orderCharges.shippingCost),
              ),
            )}
          </Typography>
        </Stack>
        <Divider />
      </SortableDnd>
    </Stack>
  );
};

export default ItemDetailsTableForm;
