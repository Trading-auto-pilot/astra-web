import { useState } from 'react';
import { Box, Paper, Stack } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useCalendarContext } from 'providers/CalendarProvider';
import CalendarHeader from 'components/sections/calendar/CalendarHeader';
import CalendarMain from 'components/sections/calendar/CalendarMain';
import CalendarSidebar from 'components/sections/calendar/CalendarSidebar/CalendarSidebar';
import CalendarTop from 'components/sections/calendar/CalendarTop';
import EventDialog from 'components/sections/calendar/EventDialog/EventDialog';

const Calendar = () => {
  const { openNewEventModal } = useCalendarContext();
  const { up } = useBreakpoints();
  const upXl = up('xl');

  const [isDrawerOpen, setIsDrawerOpen] = useState(upXl);
  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <>
      <CalendarTop />
      <Stack sx={{ flexGrow: 1, minHeight: 0 }}>
        <Box
          sx={{
            width: 352,
            display: { xs: 'none', xl: 'block' },
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <CalendarSidebar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
        </Box>

        <Paper
          sx={(theme) => ({
            flexGrow: 1,
            minWidth: 0,
            zIndex: 1,
            transition: theme.transitions.create('margin', {
              duration: theme.transitions.duration.short,
            }),
            ml: { xl: isDrawerOpen ? 0 : '-352px' },
          })}
        >
          <Stack sx={{ flexGrow: 1, flexDirection: 'column', height: 1 }}>
            <CalendarHeader toggleDrawer={toggleDrawer} />
            <CalendarMain />
          </Stack>

          <EventDialog open={openNewEventModal} />
        </Paper>
      </Stack>
    </>
  );
};

export default Calendar;
