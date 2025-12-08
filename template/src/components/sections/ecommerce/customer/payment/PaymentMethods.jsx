import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  FormControlLabel,
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

const paymentMethodsSchema = yup
  .object({
    method: yup
      .string()
      .oneOf(['cod', 'card', 'bkash'], 'Please select a valid payment method.')
      .required('This field is required'),
    cardNumber: yup.string().when('method', {
      is: 'card',
      then: (schema) => schema.required('This field is required'),
    }),
    fullName: yup.string().when('method', {
      is: 'card',
      then: (schema) => schema.required('This field is required'),
    }),
    expiryDate: yup.string().when('method', {
      is: 'card',
      then: (schema) => schema.required('This field is required'),
    }),
    cvc: yup.string().when('method', {
      is: 'card',
      then: (schema) => schema.required('This field is required'),
    }),
  })
  .required();

const paymentMethods = [
  {
    id: 'card',
    icon: 'material-symbols-light:credit-card-outline',
    title: 'Pay via Card',
    subtitle: 'Pay with your debit or credit card',
  },
  {
    id: 'cod',
    icon: 'material-symbols-light:payments-outline-rounded',
    title: 'Cash on delivery',
    subtitle: 'Pay when you receive your product',
  },
];

const PaymentMethods = () => {
  const {
    config: { assetsDir },
  } = useSettingsContext();
  const methods = useForm({
    resolver: yupResolver(paymentMethodsSchema),
  });

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = methods;
  const values = useWatch({ control });

  const onSubmit = (data) => {
    const { method, ...rest } = data;
    const filteredData = method === 'card' ? { method, ...rest } : { method };
    console.log(filteredData);

    methods.reset();
  };

  return (
    <Box component="form" id="paymentForm" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
        }}
      >
        Please choose a payment method
      </Typography>
      <Box
        sx={{
          mb: 5,
        }}
      >
        <Controller
          rules={{ required: true }}
          name="method"
          control={control}
          render={({ field }) => (
            <RadioGroup {...field} value={field.value || ''}>
              <List dense>
                {paymentMethods.map(({ id, icon, title, subtitle }) => (
                  <ListItem
                    key={id}
                    sx={{
                      cursor: 'pointer',
                      py: 2,
                      px: 4,
                      bgcolor: field.value === id ? 'primary.lighter' : 'background.elevation2',
                      borderRadius: 12,
                      mb: 2,
                      gap: 2,
                      '&:last-of-type': { mb: 0 },
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
                    <FormControlLabel
                      control={<Radio checked={field.value === id} />}
                      value={id}
                      label=""
                      sx={{ m: 0 }}
                    />
                  </ListItem>
                ))}
              </List>
            </RadioGroup>
          )}
        />
      </Box>
      {values.method === 'card' && (
        <Grid
          container
          spacing={3}
          sx={{
            mb: 7,
          }}
        >
          <Grid size={12}>
            <Stack
              sx={{
                gap: 3,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                }}
              >
                Supported cards
              </Typography>
              <Stack
                sx={{
                  gap: 1,
                }}
              >
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
              id="cardNumber"
              label="Card number"
              type="text"
              variant="filled"
              error={!!errors.cardNumber}
              helperText={errors.cardNumber?.message}
              {...register('cardNumber')}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              id="fullName"
              label="Full name"
              type="text"
              variant="filled"
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              {...register('fullName')}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              control={control}
              name="expiryDate"
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
            <Controller
              name="cvc"
              control={control}
              defaultValue=""
              render={({ field: { onChange, ...rest } }) => (
                <TextField
                  fullWidth
                  label="CVC"
                  variant="filled"
                  error={!!errors.cvc}
                  helperText={errors.cvc?.message}
                  slotProps={{
                    htmlInput: {
                      maxLength: 3,
                    },
                  }}
                  {...rest}
                  onChange={(e) => {
                    if (/^\d{0,3}$/.test(e.target.value)) {
                      onChange(e);
                    } else {
                      onChange('');
                    }
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PaymentMethods;
