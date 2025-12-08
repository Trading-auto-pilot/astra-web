import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, InputAdornment, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { useAccounts } from 'providers/AccountsProvider';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import AccountFormDialog from '../common/AccountFormDialog';
import Education from './Education';

const educationFormSchema = yup.object().shape({
  institutionName: yup.string().required('Institution name is required'),
  subject: yup.string().required('Subject is required'),
  location: yup.string().required('Location is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().nullable(),
});

const EducationHistorySection = () => {
  const { educationHistory } = useAccounts();
  const [educationHistories, setEducationHistories] = useState(educationHistory);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    defaultValues: {
      institutionName: '',
      subject: '',
      location: '',
      startDate: '',
      endDate: dayjs().format(),
    },
    resolver: yupResolver(educationFormSchema),
  });
  const {
    register,
    control,
    formState: { errors },
    reset,
  } = methods;

  useEffect(() => {
    if (selectedEducation) {
      reset(selectedEducation);
    } else {
      reset({
        institutionName: '',
        subject: '',
        location: '',
        startDate: '',
        endDate: '',
      });
    }
  }, [selectedEducation, reset]);

  const handleOpenDialog = (education) => {
    setSelectedEducation(education);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setSelectedEducation(null);
    setDialogOpen(false);
  };

  const handleFormSubmit = (data) => {
    console.log({ data });
    if (selectedEducation) {
      setEducationHistories((prev) =>
        prev.map((education) =>
          education.id === selectedEducation.id ? { ...education, ...data } : education,
        ),
      );
      enqueueSnackbar('Institution updated successfully!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
    } else {
      setEducationHistories((prev) => [...prev, { ...data, id: educationHistories.length + 1 }]);
      enqueueSnackbar('Institution added successfully!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
    }
    handleCloseDialog();
  };

  return (
    <>
      <Stack direction="column" spacing={1} sx={{ mb: 4 }}>
        {educationHistories.map((education) => (
          <Education key={education.id} education={education} handleOpenDialog={handleOpenDialog} />
        ))}
      </Stack>
      <Button
        variant="soft"
        color="neutral"
        fullWidth
        startIcon={<IconifyIcon icon="material-symbols:add" sx={{ fontSize: 20 }} />}
        onClick={() => handleOpenDialog(null)}
      >
        Add new school
      </Button>
      <FormProvider {...methods}>
        <AccountFormDialog
          title="Education Details"
          subtitle="Update your education details for accurate records and to receive relevant notifications."
          open={dialogOpen}
          onSubmit={handleFormSubmit}
          handleDialogClose={handleCloseDialog}
          sx={{
            maxWidth: 452,
          }}
        >
          <Stack direction="column" spacing={2} sx={{ p: 0.125 }}>
            <Stack direction="column" spacing={1}>
              <TextField
                label="Institution Name"
                error={!!errors.institutionName}
                helperText={errors.institutionName?.message}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        {selectedEducation?.institutionLogo ? (
                          <Image
                            src={selectedEducation?.institutionLogo}
                            alt=""
                            width={20}
                            height={20}
                          />
                        ) : (
                          <IconifyIcon icon="material-symbols:account-balance-outline-rounded" />
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
                {...register('institutionName')}
              />
              <TextField
                label="Degree/Field of Study"
                fullWidth
                error={!!errors.subject}
                helperText={errors.subject?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconifyIcon icon="material-symbols:work-outline" />
                      </InputAdornment>
                    ),
                  },
                }}
                {...register('subject')}
              />
            </Stack>
            <TextField
              label="Location"
              fullWidth
              error={!!errors.location}
              helperText={errors.location?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:location-on-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              {...register('location')}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: 1 }}>
              <Controller
                control={control}
                name="startDate"
                render={({ field: { value, onChange, ...rest } }) => (
                  <DatePicker
                    label="Start Date"
                    value={dayjs(value)}
                    onChange={(date) => onChange(date)}
                    slotProps={{
                      textField: {
                        error: !!errors.startDate,
                        helperText: errors.startDate?.message,
                      },
                      inputAdornment: {
                        position: 'start',
                      },
                    }}
                    {...rest}
                  />
                )}
              />
              <Controller
                control={control}
                name="endDate"
                render={({ field: { value, onChange, ...rest } }) => (
                  <DatePicker
                    label="End Date"
                    value={dayjs(value)}
                    onChange={(date) => onChange(date)}
                    slotProps={{
                      textField: {
                        error: !!errors.endDate,
                        helperText: errors.endDate?.message,
                      },
                      inputAdornment: {
                        position: 'start',
                      },
                    }}
                    {...rest}
                  />
                )}
              />
            </Stack>
          </Stack>
        </AccountFormDialog>
      </FormProvider>
    </>
  );
};

export default EducationHistorySection;
