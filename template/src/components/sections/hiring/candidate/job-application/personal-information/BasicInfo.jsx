import { Controller, useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import AvatarDropBox from 'components/base/AvatarDropBox';
import ApplicationFormSection from '../common/ApplicationFormSection';

const BasicInfo = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <ApplicationFormSection name="Basic">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        gap={4}
        alignItems={{ xs: 'center', sm: 'stretch' }}
      >
        <Box sx={{ py: { sm: 2 } }}>
          <Controller
            control={control}
            name="personalInfo.basic.avatar"
            render={({ field: { value, onChange } }) => {
              return (
                <AvatarDropBox
                  defaultFile={value}
                  onDrop={(acceptedFiles) => {
                    if (acceptedFiles.length > 0) {
                      onChange(acceptedFiles[0]);
                    }
                  }}
                  error={errors.personalInfo?.basic?.avatar ? 'Invalid avatar' : undefined}
                />
              );
            }}
          />
        </Box>
        <Grid container spacing={1}>
          <Grid size={6}>
            <TextField
              label="First Name"
              fullWidth
              error={!!errors.personalInfo?.basic?.firstName}
              helperText={errors.personalInfo?.basic?.firstName?.message}
              {...register('personalInfo.basic.firstName')}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Last Name"
              fullWidth
              error={!!errors.personalInfo?.basic?.lastName}
              helperText={errors.personalInfo?.basic?.lastName?.message}
              {...register('personalInfo.basic.lastName')}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Email"
              fullWidth
              error={!!errors.personalInfo?.basic?.email}
              helperText={errors.personalInfo?.basic?.email?.message}
              {...register('personalInfo.basic.email')}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Phone No"
              fullWidth
              error={!!errors.personalInfo?.basic?.phone}
              helperText={errors.personalInfo?.basic?.phone?.message}
              {...register('personalInfo.basic.phone')}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Current Address"
              fullWidth
              error={!!errors.personalInfo?.basic?.currentAddress}
              helperText={errors.personalInfo?.basic?.currentAddress?.message}
              {...register('personalInfo.basic.currentAddress')}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Permanent Address"
              fullWidth
              error={!!errors.personalInfo?.basic?.permanentAddress}
              helperText={errors.personalInfo?.basic?.permanentAddress?.message}
              {...register('personalInfo.basic.permanentAddress')}
            />
          </Grid>
        </Grid>
      </Stack>
    </ApplicationFormSection>
  );
};

export default BasicInfo;
