import { Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import { organizerEvents, organizerInfo } from 'data/events';
import EventOrganizerInfo from 'components/sections/events/event-detail/main/EventOrganizerInfo';
import EventShowcase from 'components/sections/events/event-detail/main/EventShowcase';

const EventOrganizer = () => {
  return (
    <Grid container rowSpacing={3} columnSpacing={5}>
      <Grid size={{ xs: 12, xl: 'auto' }} width={{ xl: 300 }}>
        <Container maxWidth={'sm'} sx={{ px: { xs: 0 }, height: 1 }}>
          <EventOrganizerInfo organizer={organizerInfo} />
        </Container>
      </Grid>
      <Grid size="grow">
        <EventShowcase showcase={organizerEvents} />
      </Grid>
    </Grid>
  );
};

export default EventOrganizer;
