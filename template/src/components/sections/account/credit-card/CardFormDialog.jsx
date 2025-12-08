import { Controller, useFormContext } from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  dialogClasses,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { maskCardNumber } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

const CardFormDialog = (props) => {
  const { open, handleDialogClose, card, onSubmit } = props;
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useFormContext();
  const { cardNumber } = getValues();

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        [`& .${dialogClasses.paper}`]: {
          width: 1,
          maxWidth: 576,
          borderRadius: 6,
        },
      }}
    >
      <DialogTitle
        sx={{
          pt: 3,
          pb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        {card?.cardName ? (
          <Stack spacing={2}>
            <Image src={card?.icon} alt="" width={40} height={40} />
            <Stack spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {card?.cardName}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 400, color: 'text.secondary' }}>
                {maskCardNumber(cardNumber)}
              </Typography>
            </Stack>
          </Stack>
        ) : (
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            Add information
          </Typography>
        )}

        <IconButton onClick={handleDialogClose}>
          <IconifyIcon icon="material-symbols:close" sx={{ fontSize: 20, color: 'neutral.dark' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 0 }}>
        <Stack direction="column" spacing={1} p={0.125}>
          <TextField
            label="Card number"
            fullWidth
            error={!!errors.cardNumber}
            helperText={errors.cardNumber?.message}
            {...register('cardNumber')}
          />
          <TextField
            label="Full name"
            fullWidth
            error={!!errors.cardHolder}
            helperText={errors.cardHolder?.message}
            {...register('cardHolder')}
          />
          <Stack spacing={1}>
            <Controller
              control={control}
              name="expireDate"
              render={({ field }) => (
                <DatePicker
                  label="Expiry date"
                  disablePast
                  format="DD/MM/YYYY"
                  value={field.value ? dayjs(field.value, 'DD/MM/YYYY') : null}
                  onChange={(newValue) => {
                    const formattedDate = newValue?.format('DD/MM/YYYY');
                    field.onChange(formattedDate || '');
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.expireDate,
                      helperText: errors.expireDate?.message,
                    },
                  }}
                />
              )}
            />
            <TextField
              label="CVC"
              error={!!errors.cvc}
              helperText={errors.cvc?.message}
              sx={{ width: { xs: 0.5, sm: 1 } }}
              {...register('cvc')}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
        }}
      >
        <Button
          variant="soft"
          color="neutral"
          onClick={() => {
            reset();
            handleDialogClose();
          }}
        >
          Discard
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CardFormDialog;
