import { Controller, useFormContext } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { currencyFormat } from 'lib/utils';
import ApplicationFormSection from '../common/ApplicationFormSection';

const AdditionalInfo = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <ApplicationFormSection name="Additional Information">
      <Grid container rowSpacing={{ xs: 1, sm: 2 }} columnSpacing={1}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name={`personalInfo.additionalInfo.desiredSalary`}
            control={control}
            render={({ field }) => (
              <TextField
                variant="filled"
                label="Desired Salary"
                fullWidth
                value={
                  field.value && currencyFormat(field.value, 'en-US', { maximumFractionDigits: 0 })
                }
                error={!!errors.personalInfo?.additionalInfo?.desiredSalary}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/[^0-9.]/g, '');
                  field.onChange(rawValue ? Number(rawValue) : '');
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Referred by"
            fullWidth
            error={!!errors.personalInfo?.additionalInfo?.refferedBy}
            helperText={errors.personalInfo?.additionalInfo?.refferedBy?.message}
            {...register('personalInfo.additionalInfo.refferedBy')}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label="Website/portfolio"
            fullWidth
            error={!!errors.personalInfo?.additionalInfo?.website}
            helperText={errors.personalInfo?.additionalInfo?.website?.message}
            {...register('personalInfo.additionalInfo.website')}
          />
        </Grid>
      </Grid>
    </ApplicationFormSection>
  );
};

export default AdditionalInfo;
