import { useState } from 'react';
import { Container } from '@mui/material';
import { eventInfo } from 'data/events';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useSettingsContext } from 'providers/SettingsProvider';
import Image from 'components/base/Image';
import ScrollSpy from 'components/scroll-spy';
import EventOrganizer from 'components/sections/events/event-detail/EventOrganizer';
import EventsTabPanel from 'components/sections/events/event-detail/EventsTabPanel';
import TicketPurchaseDrawer from 'components/sections/events/event-detail/TicketPurchaseDrawer';
import TicketPurchaseToolbar from 'components/sections/events/event-detail/TicketPurchaseToolbar';
import EventInfo from 'components/sections/events/event-detail/main/EventInfo';

const EventDetail = () => {
  const {
    config: { assetsDir },
  } = useSettingsContext();
  const [openPurchaseTicketDrawer, setOpenPurchaseTicketDrawer] = useState(false);
  const { up } = useBreakpoints();
  const upXl = up('xl');

  return (
    <ScrollSpy offset={600}>
      <Container maxWidth={false} sx={{ maxWidth: 1280, p: { xs: 3, md: 5 } }}>
        <Image
          src={`${assetsDir}/images/events/details/1.webp`}
          alt="Event Banner"
          sx={{
            width: 1,
            height: 300,
            borderRadius: 6,
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <EventInfo eventInfo={eventInfo} />

        <Container maxWidth={upXl ? false : 'sm'} sx={{ px: { xs: 0 } }}>
          <EventsTabPanel />
        </Container>

        <EventOrganizer />
      </Container>

      <TicketPurchaseToolbar onPurchaseClick={() => setOpenPurchaseTicketDrawer(true)} />
      <TicketPurchaseDrawer
        open={openPurchaseTicketDrawer}
        handleClose={() => setOpenPurchaseTicketDrawer(false)}
      />
    </ScrollSpy>
  );
};

export default EventDetail;
