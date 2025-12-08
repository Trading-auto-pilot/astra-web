import { Controller, useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import InvoiceDetailsFormSections from './InvoiceDetailsFormSections';

const InvoiceDetailsForm = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Grid container spacing={3} sx={{ width: 1, mb: 5, mt: 4 }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <InvoiceDetailsFormSections title="Invoice details">
          <Grid container spacing={1} sx={{ width: 1 }}>
            <Grid size={6}>
              <StyledTextField
                type="number"
                placeholder="Invoice number"
                variant="filled"
                size="large"
                {...register('invoiceDetails.invoiceNumber')}
                error={!!errors.invoiceDetails?.invoiceNumber}
                helperText={errors.invoiceDetails?.invoiceNumber?.message}
                fullWidth
                slotProps={{
                  input: {
                    sx: {
                      '& .MuiInputBase-input': {
                        color: 'text.secondary',
                        padding: '9px 16px !important',
                      },
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={6}>
              <Controller
                name="invoiceDetails.status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="currencyLabel">Status</InputLabel>
                    <Select
                      {...field}
                      id="status"
                      labelId="status"
                      label="Status"
                      error={!!errors.invoiceDetails?.status}
                      fullWidth
                    >
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="sent">Sent</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                      <MenuItem value="late">Late</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              {errors.invoiceDetails?.status && (
                <FormHelperText error sx={{ mx: '14px' }}>
                  {errors.invoiceDetails.status.message}
                </FormHelperText>
              )}
            </Grid>
          </Grid>
        </InvoiceDetailsFormSections>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <InvoiceDetailsFormSections title="Deadline">
          <Grid container spacing={1} sx={{ width: 1 }}>
            <Grid size={6}>
              <Controller
                name="deadline.issueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Issue Date"
                    format="DD/MM/YYYY"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date ? date.toDate() : null);
                    }}
                    slotProps={{
                      textField: {
                        error: !!errors.deadline?.issueDate,
                        helperText: errors.deadline?.issueDate?.message,
                      },
                    }}
                    sx={{
                      width: 1,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={6}>
              <Controller
                name="deadline.dueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Due Date"
                    format="DD/MM/YYYY"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => {
                      field.onChange(newValue && newValue.toDate());
                    }}
                    slotProps={{
                      textField: {
                        error: !!errors.deadline?.dueDate,
                        helperText: errors.deadline?.dueDate?.message,
                      },
                    }}
                    sx={{
                      width: 1,
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </InvoiceDetailsFormSections>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <InvoiceDetailsFormSections title="Order charges">
          <Grid container spacing={1} sx={{ width: 1 }}>
            <Grid size={6}>
              <Controller
                name="orderCharges.currency"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="currencyLabel">Currency</InputLabel>
                    <Select
                      {...field}
                      id="currency"
                      labelId="currency"
                      label="Currency"
                      error={!!errors.orderCharges?.currency}
                      fullWidth
                    >
                      <MenuItem value="usd">USD</MenuItem>
                      <MenuItem value="bdt">BDT</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              {errors.orderCharges?.currency && (
                <FormHelperText error sx={{ mx: '14px' }}>
                  {errors.orderCharges.currency.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid size={6}>
              <StyledTextField
                type="number"
                placeholder="Shipping cost"
                variant="filled"
                size="large"
                error={!!errors.orderCharges?.shippingCost}
                helperText={errors.orderCharges?.shippingCost?.message}
                {...register('orderCharges.shippingCost')}
                fullWidth
                slotProps={{
                  input: {
                    sx: {
                      '& .MuiInputBase-input': {
                        color: 'text.secondary',
                        padding: '9px 16px !important',
                      },
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </InvoiceDetailsFormSections>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <InvoiceDetailsFormSections title="Adjustments">
          <Grid container spacing={1} sx={{ width: 1 }}>
            <Grid size={6}>
              <StyledTextField
                type="number"
                placeholder="Discount"
                variant="filled"
                size="large"
                error={!!errors.adjustment?.discount}
                helperText={errors.adjustment?.discount?.message}
                {...register('adjustment.discount')}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon
                          icon={'material-symbols:percent'}
                          sx={{
                            fontSize: 14,
                            color: 'text.secondary',
                          }}
                        />
                      </InputAdornment>
                    ),
                    sx: {
                      '& .MuiInputBase-input': {
                        color: 'text.secondary',
                        padding: '9px 16px !important',
                      },
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={6}>
              <StyledTextField
                type="number"
                placeholder="Tax"
                variant="filled"
                size="large"
                error={!!errors.adjustment?.tax}
                helperText={errors.adjustment?.tax?.message}
                {...register('adjustment.tax')}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon
                          icon={'material-symbols:percent'}
                          sx={{
                            fontSize: 14,
                            color: 'text.secondary',
                          }}
                        />
                      </InputAdornment>
                    ),
                    sx: {
                      '& .MuiInputBase-input': {
                        color: 'text.secondary',
                        padding: '9px 16px !important',
                      },
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </InvoiceDetailsFormSections>
      </Grid>
    </Grid>
  );
};

export default InvoiceDetailsForm;
