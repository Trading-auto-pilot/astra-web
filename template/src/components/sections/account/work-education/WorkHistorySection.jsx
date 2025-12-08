import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { useAccounts } from 'providers/AccountsProvider';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import AccountFormDialog from '../common/AccountFormDialog';
import Work from './Work';

const workFormSchema = yup.object().shape({
  companyName: yup.string().required('Company name is required'),
  designation: yup.string().required('Designation is required'),
  location: yup.string().required('Location is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().nullable(),
});
const WorkHistorySection = () => {
  const { workHistory } = useAccounts();
  const [workHistories, setWorkHistories] = useState(workHistory);
  const [selectedWork, setSelectedWork] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    defaultValues: {
      companyName: '',
      designation: '',
      location: '',
      startDate: '',
      endDate: dayjs().format(),
      currentlyWorking: false,
    },
    resolver: yupResolver(workFormSchema),
  });

  const {
    register,
    control,
    formState: { errors },
    watch,
    reset,
  } = methods;

  const { currentlyWorking } = watch();
  useEffect(() => {
    if (selectedWork) {
      reset(selectedWork);
    } else {
      reset({
        companyName: '',
        designation: '',
        location: '',
        startDate: '',
        endDate: '',
      });
    }
  }, [selectedWork, reset]);

  const handleOpenDialog = (work) => {
    setSelectedWork(work);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setSelectedWork(null);
    setDialogOpen(false);
  };

  const handleFormSubmit = (data) => {
    console.log({ data });
    if (selectedWork) {
      setWorkHistories((prev) =>
        prev.map((work) => (work.id === selectedWork.id ? { ...work, ...data } : work)),
      );
      enqueueSnackbar('Work history updated successfully!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
    } else {
      setWorkHistories((prev) => [...prev, { ...data, id: workHistories.length + 1 }]);
      enqueueSnackbar('Work history added successfully!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
    }
    handleCloseDialog();
  };

  return (
    <>
      <Stack direction="column" spacing={1} sx={{ mb: 4 }}>
        {workHistories.map((work) => (
          <Work key={work.id} work={work} handleOpenDialog={handleOpenDialog} />
        ))}
      </Stack>
      <Button
        variant="soft"
        color="neutral"
        fullWidth
        startIcon={<IconifyIcon icon="material-symbols:add" sx={{ fontSize: 20 }} />}
        onClick={() => handleOpenDialog(null)}
      >
        Add new workplace
      </Button>
      <FormProvider {...methods}>
        <AccountFormDialog
          title="Workplace Details"
          subtitle="Update your workplace information is current for precise notifications and records."
          open={dialogOpen}
          onSubmit={handleFormSubmit}
          handleDialogClose={handleCloseDialog}
          handleRemove={selectedWork ? () => {} : undefined}
          sx={{
            maxWidth: 452,
          }}
        >
          <Stack direction="column" spacing={2} alignItems="flex-start" sx={{ p: 0.125 }}>
            <Stack direction="column" spacing={1} sx={{ width: 1 }}>
              <TextField
                label="Company Name"
                error={!!errors.companyName}
                helperText={errors.companyName?.message}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        {selectedWork?.companyLogo ? (
                          <Image src={selectedWork?.companyLogo} alt="" width={20} height={20} />
                        ) : (
                          <IconifyIcon icon="material-symbols:account-balance-outline-rounded" />
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
                {...register('companyName')}
              />
              <TextField
                label="Designation"
                fullWidth
                error={!!errors.designation}
                helperText={errors.designation?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconifyIcon icon="material-symbols:work-outline" />
                      </InputAdornment>
                    ),
                  },
                }}
                {...register('designation')}
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
            <Controller
              control={control}
              name="currentlyWorking"
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox checked={field.value} {...field} />}
                  label="I am currently working here"
                  sx={{ ml: 0 }}
                />
              )}
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
                    disabled={currentlyWorking}
                    value={currentlyWorking ? dayjs() : dayjs(value)}
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

export default WorkHistorySection;
