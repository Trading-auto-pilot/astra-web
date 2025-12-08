import { Controller, useFormContext } from 'react-hook-form';
import {
  Box,
  Divider,
  FormHelperText,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import * as yup from 'yup';
import AvatarDropBox from 'components/base/AvatarDropBox';
import IconifyIcon from 'components/base/IconifyIcon';
import NumberTextField from 'components/base/NumberTextField';
import ContactFormSection from 'components/sections/crm/add-contact/ContactFormSection';
import ControlledSelect from 'components/sections/crm/add-contact/ControlledSelect';

export const companyInfoSchema = yup.object({
  companyInfo: yup.object({
    avatar: yup.mixed().required('Avatar is required'),
    companyName: yup.string().required('This field is required'),
    industryType: yup.string().required('This field is required'),
    foundingYear: yup.string().nullable().required('This field is required'),
    contact: yup.object({
      officialEmail: yup.string().email('Invalid email format').required('This field is required'),
      phoneNumber: yup.string().required('This field is required'),
      streetAddress: yup.string().required('This field is required'),
      city: yup.string().required('City is required'),
      state: yup.string().required('State is required'),
      country: yup.string().required('Country is required'),
      zipCode: yup.string().required('Zip Code is required'),
    }),
    website: yup.string().url('Invalid website URL').optional(),
    note: yup.string().optional(),
  }),
});

const industryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'healthcare', label: 'Healthcare & Pharmaceuticals' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'marketing', label: 'Marketing & Advertising' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'government', label: 'Government & Public Services' },
];

const CompanyInfoForm = ({ label }) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <Box sx={{ mb: 4.5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {label}
        </Typography>
        <Divider />
      </Box>

      <Stack direction="column" spacing={4}>
        <ContactFormSection title="Company Logo">
          <Controller
            control={control}
            name="companyInfo.avatar"
            render={({ field: { value, onChange } }) => {
              return (
                <AvatarDropBox
                  defaultFile={value}
                  onDrop={(acceptedFiles) => {
                    if (acceptedFiles.length > 0) {
                      onChange(acceptedFiles[0]);
                    }
                  }}
                  error={errors.companyInfo?.avatar ? 'Invalid avatar' : undefined}
                />
              );
            }}
          />
          {errors.companyInfo?.avatar?.message && (
            <FormHelperText error>{errors.companyInfo.avatar.message}</FormHelperText>
          )}
          <Typography variant="caption" color="text.secondary">
            JPG or PNG, Recommended size 1:1, Up to 10MB.
          </Typography>
        </ContactFormSection>
        <ContactFormSection title="Company Details">
          <TextField
            fullWidth
            label="Company Name"
            error={!!errors.companyInfo?.companyName}
            helperText={errors.companyInfo?.companyName?.message}
            {...register('companyInfo.companyName')}
          />
          <Grid container spacing={2} sx={{ width: 1 }}>
            <Grid size={6}>
              <ControlledSelect
                name="companyInfo.industryType"
                label="Industry Type"
                options={industryOptions}
                control={control}
                error={errors.companyInfo?.industryType?.message}
              />
            </Grid>
            <Grid size={6}>
              <Controller
                control={control}
                name="companyInfo.foundingYear"
                render={({ field: { value, onChange, ...rest } }) => (
                  <DatePicker
                    views={['year']}
                    disableFuture
                    openTo="year"
                    label="Founding Year"
                    value={value ? dayjs(value) : null}
                    onChange={(date) => onChange(date ? date.toString() : null)}
                    slotProps={{
                      textField: {
                        error: !!errors.companyInfo?.foundingYear,
                        helperText: errors.companyInfo?.foundingYear?.message,
                      },
                    }}
                    sx={{ width: 1 }}
                    {...rest}
                  />
                )}
              />
            </Grid>
          </Grid>
        </ContactFormSection>

        <ContactFormSection title="Contact Information">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Official Email"
                error={!!errors.companyInfo?.contact?.officialEmail}
                helperText={errors.companyInfo?.contact?.officialEmail?.message}
                {...register('companyInfo.contact.officialEmail')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <NumberTextField
                fullWidth
                label="Phone Number"
                error={!!errors.companyInfo?.contact?.phoneNumber}
                helperText={errors.companyInfo?.contact?.phoneNumber?.message}
                {...register('companyInfo.contact.phoneNumber')}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Street Address"
                error={!!errors.companyInfo?.contact?.streetAddress}
                helperText={errors.companyInfo?.contact?.streetAddress?.message}
                {...register('companyInfo.contact.streetAddress')}
              />
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <TextField
                fullWidth
                label="City"
                error={!!errors.companyInfo?.contact?.city}
                helperText={errors.companyInfo?.contact?.city?.message}
                {...register('companyInfo.contact.city')}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField
                fullWidth
                label="State"
                error={!!errors.companyInfo?.contact?.state}
                helperText={errors.companyInfo?.contact?.state?.message}
                {...register('companyInfo.contact.state')}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Country"
                error={!!errors.companyInfo?.contact?.country}
                helperText={errors.companyInfo?.contact?.country?.message}
                {...register('companyInfo.contact.country')}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberTextField
                fullWidth
                label="Zip Code"
                error={!!errors.companyInfo?.contact?.zipCode}
                helperText={errors.companyInfo?.contact?.zipCode?.message}
                {...register('companyInfo.contact.zipCode')}
              />
            </Grid>
          </Grid>
        </ContactFormSection>

        <ContactFormSection title="Additional Information">
          <TextField
            label={
              <Typography variant="subtitle2" fontWeight={400}>
                Website
                <Box component="span" sx={{ color: 'text.disabled', ml: 0.5 }}>
                  ( optional )
                </Box>
              </Typography>
            }
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconifyIcon icon="material-symbols:language" />
                  </InputAdornment>
                ),
              },
            }}
            error={!!errors.companyInfo?.website}
            helperText={errors.companyInfo?.website?.message}
            {...register('companyInfo.website')}
          />

          <TextField
            fullWidth
            label={
              <Typography variant="subtitle2" fontWeight={400}>
                Add note
                <Box component="span" sx={{ color: 'text.disabled', ml: 0.5 }}>
                  ( optional )
                </Box>
              </Typography>
            }
            multiline
            rows={3}
            {...register('companyInfo.note')}
          />
        </ContactFormSection>
      </Stack>
    </div>
  );
};

export default CompanyInfoForm;
