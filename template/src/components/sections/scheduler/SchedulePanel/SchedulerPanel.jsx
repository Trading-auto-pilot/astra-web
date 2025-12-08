import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { createRecurringEventsForSlot } from 'pages/apps/calendar/Scheduler';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import AppointmentConfig from 'components/sections/scheduler/SchedulePanel/AppointmentConfig';
import AvailabilityConfig from 'components/sections/scheduler/SchedulePanel/AvailabilityConfig';
import ScheduleConfig from 'components/sections/scheduler/SchedulePanel/ScheduleConfig';
import { useScheduleColors } from 'components/sections/scheduler/SchedulePanel/useSchedulerColors';

const schema = yup.object().shape({
  title: yup.string().required('required*'),
  duration: yup.string().required('required*'),
  timeZone: yup.string().required('required*'),
  virtualLink: yup.string().url('provide valid url').optional(),
  location: yup.string().optional(),
  guests: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required(),
      }),
    )
    .optional(),
  preMeetingAlert: yup.string().required('required*'),
  alertBefore: yup.object().shape({
    value: yup.number().min(0).required('required*'),
    unit: yup.string().required('required*'),
  }),
  color: yup.string().required('required*'),
  appointmentType: yup.string().required('required*'),
  access: yup.string().oneOf(['private', 'public']).required('required*'),

  config: yup.object().shape({
    bufferTime: yup.number().min(0, 'minimum 0 !').optional(),
    bufferTimeUnit: yup.string().oneOf(['minutes', 'hr', 'day']).optional(),
    maxBookingsPerDay: yup.number().min(0, 'minimum 0 !').optional(),
    canInviteOthers: yup.boolean().optional(),
  }),
  availability: yup.array().of(
    yup.object().shape({
      day: yup.string().required(),
      disabled: yup.boolean().required(),
      timeSlots: yup.array().of(
        yup.object().shape({
          start: yup.string().required('Start time is required'),
          end: yup.string().required('End time is required'),
          id: yup.string(),
        }),
      ),
    }),
  ),
  repeatedAppointment: yup
    .string()
    .oneOf(['none', 'daily', 'weekly', 'monthly'])
    .required('required*'),
});

const SchedulerPanel = ({
  toggleDrawer,
  onAddAppointments,
  onUpdateAppointments,
  onRemoveAppointments,
}) => {
  const { colorMap } = useScheduleColors();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      duration: '1hr',
      timeZone: 'PST',
      virtualLink: '',
      location: '',
      guests: [],
      preMeetingAlert: 'notifications',
      alertBefore: { value: 0, unit: 'minute' },
      color: colorMap.primary,
      appointmentType: 'follow-up',
      access: 'private',
      config: {
        bufferTime: 0,
        bufferTimeUnit: 'minutes',
        maxBookingsPerDay: 0,
        canInviteOthers: false,
      },
      availability: [
        { day: 'Sunday', disabled: true, timeSlots: [] },
        {
          day: 'Monday',
          disabled: false,
          timeSlots: [
            { start: '00:00', end: '01:00', id: '1-09:00-10:00' },
            { start: '11:00', end: '12:00', id: '1-11:00-12:00' },
          ],
        },
        { day: 'Tuesday', disabled: true, timeSlots: [] },
        {
          day: 'Wednesday',
          disabled: false,
          timeSlots: [{ start: '14:00', end: '15:00', id: '3-14:00-15:00' }],
        },
        { day: 'Thursday', disabled: true, timeSlots: [] },
        { day: 'Friday', disabled: true, timeSlots: [] },
        { day: 'Saturday', disabled: true, timeSlots: [] },
      ],

      repeatedAppointment: 'none',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    console.log('Form Data:', { data, errors });

    enqueueSnackbar('Appointment saved successfully!', { variant: 'success' });

    reset();
  };

  useEffect(() => {
    const availability = methods.getValues('availability') ?? [];
    const repetition = methods.getValues('repeatedAppointment');

    const initialEvents = [];

    availability.forEach((day, dayIndex) => {
      (day.timeSlots || []).forEach((slot) => {
        const timeSlotWithId = {
          ...slot,
          id: slot.id ?? `${dayIndex}-${slot.start}-${slot.end}`,
        };

        const events = createRecurringEventsForSlot(dayIndex, timeSlotWithId, repetition);
        initialEvents.push(...events);
      });
    });

    onAddAppointments(initialEvents);
  }, []);

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction="column"
          divider={
            <Divider
              sx={{
                '&:last-of-type': {
                  borderBottom: 'none',
                },
              }}
            />
          }
        >
          <Stack
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 3,
              pt: '22px',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                lineHeight: '2rem',
              }}
            >
              Scheduler Settings
            </Typography>
            <Button
              onClick={toggleDrawer}
              variant="text"
              color="neutral"
              size="small"
              shape="circle"
            >
              <IconifyIcon height={20} icon="material-symbols:close-rounded" sx={{ width: 1 }} />
            </Button>
          </Stack>
          <ScheduleConfig />
          <AvailabilityConfig
            onAddSlot={(dayIndex, slot, repetition = 'none') => {
              const formValues = methods.getValues();
              const color = formValues.color;
              const events = createRecurringEventsForSlot(dayIndex, slot, repetition, color);
              onAddAppointments(events);
            }}
            onUpdateSlot={(dayIndex, updatedSlot, slotIndex) => {
              if (onUpdateAppointments) {
                onUpdateAppointments(dayIndex, updatedSlot, slotIndex);
              }
            }}
            onRemoveSlot={onRemoveAppointments}
          />
          <AppointmentConfig />
          <Stack spacing={2} justifyContent="flex-end" sx={{ p: 3 }}>
            <Button variant="soft" color="neutral" onClick={toggleDrawer}>
              Discard
            </Button>
            <Button type="submit" variant="contained" sx={{ px: 3 }}>
              Save
            </Button>
          </Stack>
        </Stack>
      </Box>
    </FormProvider>
  );
};

export default SchedulerPanel;
