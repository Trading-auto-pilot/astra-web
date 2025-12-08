import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  chipClasses,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import NumberTextField from 'components/base/NumberTextField';
import StyledTextField from 'components/styled/StyledTextField';

const TicketPrice = ({ handleClose }) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'ticketPricing.options',
  });

  const ticketType = useWatch({
    control,
    name: 'ticketPricing.ticketType',
  });

  const handleTicketTypeChange = (value) => {
    if (value === 'free') {
      replace([]);
    } else if (fields.length === 0) {
      append({
        name: '',
        price: undefined,
        noOfTickets: undefined,
        facilities: ['Club', 'Stadium', 'Arena', 'Pool'],
      });
    }
  };

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack justifyContent="space-between" mb={3}>
        <Typography variant="h6">Ticket Price</Typography>

        {handleClose && (
          <Button shape="circle" variant="soft" color="neutral" onClick={handleClose}>
            <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 20 }} />
          </Button>
        )}
      </Stack>

      <Stack direction="column" spacing={3}>
        <Controller
          name="ticketPricing.ticketType"
          control={control}
          render={({ field }) => (
            <RadioGroup
              row
              value={field.value}
              onChange={(e) => {
                const newValue = e.target.value;
                field.onChange(newValue);
                handleTicketTypeChange(newValue);
              }}
            >
              <FormControlLabel
                value="free"
                control={<Radio />}
                label={
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={400}>
                    Free
                  </Typography>
                }
              />
              <FormControlLabel
                value="paid"
                control={<Radio />}
                label={
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={400}>
                    Paid
                  </Typography>
                }
              />
            </RadioGroup>
          )}
        />

        {ticketType === 'paid' && (
          <Stack direction="column" spacing={3} sx={{ mb: fields.length > 0 ? 3 : 0 }}>
            {fields.map((item, index) => (
              <Stack
                key={item.id}
                direction="row"
                alignItems="flex-start"
                spacing={{ xs: 1, lg: 2 }}
              >
                <Stack direction="column" spacing={1} flexGrow={1}>
                  <TextField
                    fullWidth
                    type="text"
                    label="Options"
                    placeholder="VIP"
                    {...register(`ticketPricing.options.${index}.name`)}
                    error={!!errors.ticketPricing?.options?.[index]?.name}
                    helperText={errors.ticketPricing?.options?.[index]?.name?.message}
                  />
                  <Stack spacing={1}>
                    <NumberTextField
                      fullWidth
                      label="Price"
                      placeholder="$0.00"
                      error={!!errors.ticketPricing?.options?.[index]?.price}
                      helperText={errors.ticketPricing?.options?.[index]?.price?.message}
                      {...register(`ticketPricing.options.${index}.price`, {
                        setValueAs: (value) => Number(value),
                      })}
                    />
                    <NumberTextField
                      fullWidth
                      label="No. of tickets"
                      error={!!errors.ticketPricing?.options?.[index]?.noOfTickets}
                      helperText={errors.ticketPricing?.options?.[index]?.noOfTickets?.message}
                      {...register(`ticketPricing.options.${index}.noOfTickets`, {
                        setValueAs: (value) => Number(value),
                      })}
                    />
                  </Stack>
                  <Controller
                    name={`ticketPricing.options.${index}.facilities`}
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        disableClearable
                        multiple
                        freeSolo
                        value={field.value || []}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        options={[]}
                        renderInput={(params) => (
                          <StyledTextField
                            {...params}
                            error={!!errors.ticketPricing?.options?.[index]?.facilities}
                            helperText={errors.ticketPricing?.options?.[index]?.facilities?.message}
                            sx={{ p: 0 }}
                          />
                        )}
                        sx={{
                          [`& .${chipClasses.label}`]: { overflow: 'visible' },
                        }}
                      />
                    )}
                  />
                </Stack>
                <IconButton color="error" onClick={() => remove(index)}>
                  <IconifyIcon icon="material-symbols:delete-outline-rounded" fontSize={20} />
                </IconButton>
              </Stack>
            ))}

            {!!errors.ticketPricing?.options && (
              <Typography color="error" variant="body2">
                {errors.ticketPricing?.options.message}
              </Typography>
            )}
          </Stack>
        )}
      </Stack>

      {ticketType === 'paid' && (
        <Button
          onClick={() =>
            append({
              name: '',
              price: 0,
              noOfTickets: 0,
              facilities: ['Club', 'Stadium', 'Arena', 'Pool'],
            })
          }
          color="neutral"
          size="small"
          variant="text"
          startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}
        >
          Add another option
        </Button>
      )}
    </Box>
  );
};

export default TicketPrice;
