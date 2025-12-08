import { useState } from 'react';
import { Box, Drawer, Paper, Stack, drawerClasses } from '@mui/material';
import EventsCalendar from './EventsCalendar/EventsCalendar';
import EventsTimeline from './EventsTimeline';

const Events = ({ events }) => {
  const [currentEvents, setCurrentEvents] = useState(events);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Paper component={Stack} alignItems="center">
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          [`& .${drawerClasses.paper}`]: {
            width: 350,
          },
          display: { xs: 'block', md: 'none' },
        }}
      >
        <EventsTimeline events={currentEvents} handleDrawerClose={handleDrawerClose} />
      </Drawer>

      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          maxWidth: 320,
        }}
      >
        <EventsTimeline events={currentEvents} />
      </Box>

      <Box sx={{ flexShrink: 0, flexGrow: 1 }}>
        <EventsCalendar
          events={currentEvents}
          setEvents={setCurrentEvents}
          onOpenDrawer={handleDrawerOpen}
        />
      </Box>
    </Paper>
  );
};

export default Events;
