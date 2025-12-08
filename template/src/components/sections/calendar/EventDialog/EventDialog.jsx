import { FormProvider } from 'react-hook-form';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  dialogClasses,
  dialogTitleClasses,
  toggleButtonClasses,
} from '@mui/material';
import { useCalendarContext } from 'providers/CalendarProvider';
import { SET_CALENDAR_STATE } from 'reducers/CalendarReducer';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import SimpleBar from 'components/base/SimpleBar';
import CalendarEventForm from 'components/sections/calendar/EventDialog/CalendarEventForm';
import CalendarTaskForm from 'components/sections/calendar/EventDialog/CalendarTaskForm';
import useEventDialog from 'components/sections/calendar/useEventDialog';

export const calendarEventSchema = yup
  .object({
    title: yup.string().required('This field is required'),
    category: yup.string().required('This field is required'),
    start: yup.mixed().required('This field is required'),
    end: yup.mixed().nullable().required('This field is required'),
    eventType: yup.string().required('This field is required'),
    url: yup.string(),
    location: yup.string(),
    description: yup.string(),
    allDay: yup.boolean().default(false),
    notifyInMinutes: yup.number(),
  })
  .required();

export const calendarTaskSchema = yup
  .object({
    title: yup.string().required('This field is required'),
    selectedList: yup.string().required('This field is required'),
    start: yup.mixed().required('Start date is required'),
    end: yup.mixed().nullable().required('This field is required'),
    repeated: yup.string(),
    description: yup.string(),
    allDay: yup.boolean().default(false),
  })
  .required();

const EventDialog = ({ open }) => {
  const { calendarDispatch, selectedItem } = useCalendarContext();
  const { methods, formType, setFormType, handleSubmit } = useEventDialog();

  return (
    <FormProvider {...methods}>
      <Box component="form" noValidate>
        <Dialog
          open={open}
          onClose={() =>
            calendarDispatch({ type: SET_CALENDAR_STATE, payload: { openNewEventModal: false } })
          }
          fullWidth
          sx={{
            overflow: 'auto',
            [`& .${dialogClasses.paper}`]: {
              borderRadius: 6,
              m: 0,
              p: { xs: 3, sm: 5 },
              maxWidth: { sm: '540px !important' },
            },
            [`& .${dialogClasses.container}`]: {
              py: 5,
              height: 'unset',
            },
          }}
        >
          <Stack sx={{ mb: 3, alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              {selectedItem ? `Update ${formType}` : `Create ${formType}`}
            </Typography>
            <IconButton
              onClick={() =>
                calendarDispatch({
                  type: SET_CALENDAR_STATE,
                  payload: { openNewEventModal: false },
                })
              }
            >
              <IconifyIcon
                icon="material-symbols:close"
                sx={{ fontSize: 20, color: 'neutral.dark' }}
              />
            </IconButton>
          </Stack>
          {!selectedItem && (
            <DialogTitle
              sx={{
                [`&.${dialogTitleClasses.root}`]: {
                  p: 0,
                  mb: 3,
                },
              }}
            >
              <ToggleButtonGroup
                color="primary"
                value={formType}
                exclusive
                onChange={(_, newType) => {
                  if (newType) {
                    setFormType(newType);
                  }
                }}
                fullWidth
                sx={{
                  width: 1,
                  [`& :not(.${toggleButtonClasses.selected})`]: {
                    color: 'neutral.dark',
                  },
                }}
              >
                <ToggleButton value="event">Event</ToggleButton>
                <ToggleButton value="task">Task</ToggleButton>
              </ToggleButtonGroup>
            </DialogTitle>
          )}{' '}
          <SimpleBar
            forceVisible="y"
            autoHide={true}
            sx={{ pb: 2, maxHeight: '60vh', scrollbarWidth: 'none', overflow: 'initial' }}
          >
            <DialogContent sx={{ p: '1px' }}>
              {formType === 'event' ? <CalendarEventForm /> : <CalendarTaskForm />}
              <Stack sx={{ justifyContent: 'space-between', mt: 2 }}>
                <Button
                  onClick={() =>
                    calendarDispatch({
                      type: SET_CALENDAR_STATE,
                      payload: { openNewEventModal: false },
                    })
                  }
                  color="neutral"
                >
                  Discard
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                  {selectedItem ? `Update ${formType}` : `Add ${formType}`}
                </Button>
              </Stack>
            </DialogContent>
          </SimpleBar>
        </Dialog>
      </Box>
    </FormProvider>
  );
};

export default EventDialog;
