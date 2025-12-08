import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { inputBaseClasses } from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import useNumberFormat from 'hooks/useNumberFormat';
import { getPercentageStr } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';

const CreateOrderPaymentSummary = ({ items }) => {
  const { currencyFormat } = useNumberFormat();
  const [discountType, setDiscountType] = useState('%');
  const shippingCost = 4;
  const discountAmount = 50;

  const total = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price.regular * item.quantity, 0);
  }, [items, discountType]);

  return (
    <Box
      sx={{
        bgcolor: 'background.elevation1',
        borderRadius: 6,
        p: 3,
      }}
    >
      <PriceSummaryRow label="Subtotal" value={total} sx={{ mb: 2 }} />
      <PriceSummaryEditableRow
        label="Add Shipping cost"
        action={
          <StyledTextField
            value={currencyFormat(shippingCost)}
            sx={{
              width: 84,
              [`& .${inputBaseClasses.input}`]: {
                textAlign: 'right',
              },
            }}
          />
        }
        labelStyles={{ lineClamp: 0, wordBreak: 'normal', mt: 0.25 }}
        sx={{ mb: 3, gap: 1, alignItems: 'flex-start' }}
      />
      <PriceSummaryEditableRow
        label="Add Discount"
        action={
          <Stack
            spacing={1}
            sx={{ alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap' }}
          >
            <ToggleButtonGroup
              exclusive
              value={discountType}
              onChange={(_, value) => {
                if (value !== null) {
                  setDiscountType(value);
                }
              }}
              sx={{ p: 0, gap: 0.5 }}
            >
              <ToggleButton value="%" sx={{ width: 40 }}>
                <IconifyIcon
                  icon="material-symbols:percent-rounded"
                  sx={{ fontSize: 20, color: 'text.primary' }}
                />
              </ToggleButton>
              <ToggleButton value="$" sx={{ width: 40 }}>
                <IconifyIcon
                  icon="material-symbols:attach-money-rounded"
                  sx={{ fontSize: 20, color: 'text.primary' }}
                />
              </ToggleButton>
            </ToggleButtonGroup>

            <StyledTextField
              value={
                discountType === '$'
                  ? currencyFormat(discountAmount)
                  : getPercentageStr(discountAmount, 100)
              }
              sx={{
                width: 84,
                [`& .${inputBaseClasses.input}`]: {
                  textAlign: 'right',
                },
              }}
            />
          </Stack>
        }
        labelStyles={{ lineClamp: 'unset', textWrap: 'nowrap', overflow: 'unset', mt: 0.25 }}
        sx={{ mb: 3, gap: 1, alignItems: 'flex-start' }}
      />

      <Stack
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Total
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {discountType === '%'
            ? currencyFormat(((total + shippingCost) * discountAmount) / 100)
            : currencyFormat(total + shippingCost - discountAmount)}
        </Typography>
      </Stack>
    </Box>
  );
};

const PriceSummaryRow = ({ label, value, labelStyles, sx }) => {
  const { currencyFormat } = useNumberFormat();

  return (
    <Stack
      sx={{ justifyContent: 'space-between', alignItems: 'center', color: 'text.secondary', ...sx }}
    >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 700, lineClamp: 1, wordBreak: 'break-all', ...labelStyles }}
      >
        {label}
      </Typography>
      <Typography variant="subtitle1">{currencyFormat(value)}</Typography>
    </Stack>
  );
};

const PriceSummaryEditableRow = ({ label, action, labelStyles, sx }) => {
  return (
    <Stack
      sx={{ justifyContent: 'space-between', alignItems: 'center', color: 'text.secondary', ...sx }}
    >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 700, lineClamp: 1, wordBreak: 'break-all', ...labelStyles }}
      >
        {label}
      </Typography>
      {action}
    </Stack>
  );
};

export default CreateOrderPaymentSummary;
