import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
  dialogClasses,
} from '@mui/material';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import objectSupport from 'dayjs/plugin/objectSupport';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import EventDetails from './EventDetails';
import EventNotes from './EventNotes';
import EventTitleTime from './EventTitleTime';

dayjs.extend(objectSupport);
dayjs.extend(customParseFormat);

const scheduleFormSchema = yup.object().shape({
  title: yup.string().required('Field is required'),
  allDayEvent: yup.boolean().required(),
  category: yup.string().required(),
  startDate: yup.string().required('Field is required'),
  startTime: yup.string().required('Field is required'),
  endDate: yup.string().required('Field is required'),
  endTime: yup.string().required('Field is required'),
  eventType: yup.string().required('Field is required'),
  virtualLink: yup
    .string()
    .when('eventType', {
      is: 'hybrid',
      then: (schema) => schema.url().required('Field is required'),
      otherwise: (schema) => schema.nullable(),
    })
    .when('eventType', {
      is: 'online',
      then: (schema) => schema.url().required('Field is required'),
      otherwise: (schema) => schema.nullable(),
    }),
  physical: yup
    .string()
    .when('eventType', {
      is: 'hybrid',
      then: (schema) => schema.required('Field is required'),
      otherwise: (schema) => schema.nullable(),
    })
    .when('eventType', {
      is: 'physical',
      then: (schema) => schema.required('Field is required'),
      otherwise: (schema) => schema.nullable(),
    }),
  members: yup.array().of(yup.mixed().required()).required(),
  notificationMinutesBefore: yup.number().required(),
  notes: yup.string(),
});

const ScheduleDialog = ({
  open,
  handleClose,
  date,
  selectedEvent,
  sx,
  onSubmit,
  selectedDates,
  ...rest
}) => {
  const methods = useForm({
    defaultValues: {
      title: selectedEvent?.title ? selectedEvent?.title : '',
      allDayEvent: selectedEvent?.allDayEvent ? selectedEvent?.allDayEvent : false,
      category: selectedEvent?.category ? selectedEvent?.category : 'my_events',
      startDate: selectedEvent?.startDate
        ? dayjs(selectedEvent?.startDate).format('DD.MM.YYYY')
        : dayjs(selectedDates?.start).format('DD.MM.YYYY'),
      endDate: selectedEvent?.endDate
        ? dayjs(selectedEvent?.endDate).format('DD.MM.YYYY')
        : dayjs(selectedDates?.end).format('DD.MM.YYYY'),
      startTime: selectedEvent?.startTime
        ? dayjs(selectedEvent?.startTime, 'h:mm a').format('h:mm a')
        : dayjs('12:00 am', 'h:mm a').format('h:mm a'),
      endTime: selectedEvent?.endTime
        ? dayjs(selectedEvent?.endTime, 'h:mm a').format('h:mm a')
        : dayjs('11:59 pm', 'h:mm a').format('h:mm a'),
      eventType: selectedEvent?.eventType ? selectedEvent?.eventType : 'hybrid',
      virtualLink: selectedEvent?.virtualLink ? selectedEvent?.virtualLink : '',
      physical: selectedEvent?.physical ? selectedEvent?.physical : '',
      members: selectedEvent?.members ? selectedEvent?.members : [],
      notificationMinutesBefore: selectedEvent?.notificationMinutesBefore
        ? selectedEvent?.notificationMinutesBefore
        : 15,
      notes: selectedEvent?.notes ? selectedEvent?.notes : '',
    },
    resolver: yupResolver(scheduleFormSchema),
  });
  const { down } = useBreakpoints();
  const downSm = down('sm');
  const { handleSubmit, reset } = methods;

  const dialogClose = () => {
    reset();
    handleClose();
  };

  return (
    <FormProvider {...methods}>
      <Dialog
        open={open}
        onClose={dialogClose}
        scroll="paper"
        fullScreen={downSm}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: handleSubmit(onSubmit),
            variant: 'elevation',
            sx: {
              borderRadius: { xs: 0, sm: 6 },
              overflow: 'visible',
              width: 1,
              ...sx,
            },
          },
        }}
        sx={{
          [`& .${dialogClasses.container}`]: {
            '&::after': {
              content: 'none',
            },
          },
          [`& .${dialogClasses.paperScrollPaper}`]: {
            maxWidth: { sm: '470px !important' },
          },
        }}
        {...rest}
      >
        <DialogTitle
          component={Stack}
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 5, pb: 3 }}
        >
          <Typography variant="h6">Create schedule</Typography>
          <IconButton onClick={handleClose}>
            <IconifyIcon
              icon="material-symbols:close"
              sx={{ fontSize: 20, color: 'neutral.dark' }}
            />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 5, pb: 0, scrollbarWidth: 'none' }}>
          <Stack direction="column" spacing={3} divider={<Divider />}>
            <EventTitleTime />
            <EventDetails />
            <EventNotes />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', p: 5, pt: 3 }}>
          <Button color="neutral" onClick={dialogClose}>
            Discard
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};

export default ScheduleDialog;
