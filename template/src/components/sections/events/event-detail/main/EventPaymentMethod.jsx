import { Controller, useFormContext, useWatch } from 'react-hook-form';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DateField } from '@mui/x-date-pickers';
import { useSettingsContext } from 'providers/SettingsProvider';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

const paymentMethods = [
  {
    id: 'card',
    icon: 'material-symbols:credit-card-outline',
    title: 'Pay via Card',
    subtitle: 'Pay with your debit or credit card',
  },
  {
    id: 'cod',
    icon: 'material-symbols:payments-outline-rounded',
    title: 'Cash on delivery',
    subtitle: 'Pay when you receive your product',
  },
];

export const EventPaymentMethodSchema = yup.object().shape({
  method: yup
    .string()
    .oneOf(['cod', 'card', 'bkash'], 'Please select a valid payment method.')
    .required('This field is required'),
  cardDetails: yup
    .object({
      cardNumber: yup.string().required('This field is required'),
      name: yup.string().required('This field is required'),
      expiryDate: yup.string().required('This field is required'),
      cvc: yup.string().required('This field is required'),
    })
    .nullable()
    .when('method', {
      is: 'card',
      then: (schema) => schema.required(),
      otherwise: (schema) =>
        schema
          .nullable()
          .notRequired()
          .transform(() => null),
    }),
});

const EventPaymentMethod = () => {
  const {
    config: { assetsDir },
  } = useSettingsContext();
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const method = useWatch({ control, name: 'method' });

  return (
    <div>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 3, lineHeight: 1.5 }}>
          Please choose a payment method
        </Typography>

        <Controller
          rules={{ required: true }}
          name="method"
          control={control}
          render={({ field }) => (
            <RadioGroup {...field} value={field.value || 'card'}>
              <List
                disablePadding
                dense
                sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}
              >
                {paymentMethods.map(({ id, icon, title, subtitle }) => (
                  <ListItem
                    key={id}
                    sx={{
                      cursor: 'pointer',
                      py: 2,
                      px: 4,
                      bgcolor: field.value === id ? 'primary.lighter' : 'background.elevation2',
                      borderRadius: 12,
                      gap: 3,
                    }}
                    onClick={() => field.onChange(id)}
                  >
                    <IconifyIcon icon={icon} color="primary.dark" fontSize={38} />
                    <ListItemText
                      primary={title}
                      secondary={subtitle}
                      slotProps={{
                        primary: { fontWeight: 700, fontSize: '16px !important' },
                        secondary: { fontSize: '12px !important' },
                      }}
                    />
                    <Radio checked={field.value === id} />
                  </ListItem>
                ))}
              </List>
            </RadioGroup>
          )}
        />
      </Box>

      {method === 'card' && (
        <Grid container rowSpacing={3} columnSpacing={1} sx={{ mb: 5, pb: '1px' }}>
          <Grid size={12}>
            <Stack gap={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Supported cards
              </Typography>
              <Stack gap={1}>
                <Image src={`${assetsDir}/images/logo/10.svg`} height={24} />
                <Image src={`${assetsDir}/images/logo/9.svg`} height={24} />
                <Image src={`${assetsDir}/images/logo/8.svg`} height={24} />
                <Image src={`${assetsDir}/images/logo/7.svg`} height={24} />
              </Stack>
            </Stack>
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Card number"
              type="text"
              variant="filled"
              error={!!errors.cardDetails?.cardNumber}
              helperText={errors.cardDetails?.cardNumber?.message}
              {...register('cardDetails.cardNumber')}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Full name"
              type="text"
              variant="filled"
              error={!!errors.cardDetails?.name}
              helperText={errors.cardDetails?.name?.message}
              {...register('cardDetails.name')}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              control={control}
              name="cardDetails.expiryDate"
              render={({ field: { onChange } }) => (
                <DateField
                  fullWidth
                  label="Expiry date"
                  format="MM/YY"
                  onChange={(date) => onChange(date?.format('MM/YY'))}
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="CVC"
              type="text"
              variant="filled"
              error={!!errors.cardDetails?.cvc}
              helperText={errors.cardDetails?.cvc?.message}
              {...register('cardDetails.cvc')}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default EventPaymentMethod;
