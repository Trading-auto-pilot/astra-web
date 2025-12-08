import { useEffect, useRef, useState } from 'react';
import { TabContext, TabList } from '@mui/lab';
import { Box, Paper, Stack, Tab, tabScrollButtonClasses, tabsClasses } from '@mui/material';
import { description, eventTermsConditions, performerList, schedule } from 'data/events';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { HashLinkBehavior } from 'theme/components/Link';
import { useScrollSpyContext } from 'components/scroll-spy';
import ScrollSpyNavItem from 'components/scroll-spy/ScrollSpyNavItem';
import EventDescription from 'components/sections/events/event-detail/main/EventDescription';
import EventPerformers from 'components/sections/events/event-detail/main/EventPerformers';
import EventSchedule from 'components/sections/events/event-detail/main/EventSchedule';
import EventTerms from 'components/sections/events/event-detail/main/EventTerms';

const eventTabs = [
  { label: 'Description', id: 'description' },
  { label: 'Details', id: 'details' },
  { label: 'Performer’s list', id: 'performers' },
  { label: 'Event terms & conditions', id: 'terms' },
];

const EventsTabPanel = () => {
  const { down } = useBreakpoints();
  const isDownSm = down('sm');

  const tabsRef = useRef(null);

  const { topbarHeight } = useNavContext();
  const { activeElemId } = useScrollSpyContext();
  const [activeTab, setActiveTab] = useState(activeElemId || 'description');
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (activeElemId && activeTab !== activeElemId) {
      setActiveTab(activeElemId);
    }
  }, [activeElemId, activeTab]);

  return (
    <Paper sx={{ outline: 0 }}>
      <TabContext value={activeTab}>
        <Box
          ref={tabsRef}
          sx={{
            position: 'sticky',
            zIndex: 10,
            mb: 2,
            top: topbarHeight,
            bgcolor: 'background.default',
          }}
        >
          <ScrollSpyNavItem>
            <TabList
              variant={isDownSm ? 'scrollable' : 'standard'}
              scrollButtons
              allowScrollButtonsMobile
              onChange={handleTabChange}
              aria-label="event information tabs"
              centered={isDownSm ? false : true}
              sx={{
                py: 2,
                [`& .${tabsClasses.flexContainer}`]: { gap: 0, justifyContent: 'flex-start' },
                [`& .${tabScrollButtonClasses.disabled}`]: { opacity: '0.3 !important' },
              }}
            >
              {eventTabs.map(({ label, id }) => (
                <Tab
                  LinkComponent={HashLinkBehavior}
                  href={`#${id}`}
                  key={id}
                  value={id}
                  label={label}
                />
              ))}
            </TabList>
          </ScrollSpyNavItem>
        </Box>
      </TabContext>

      <Stack direction="column" spacing={3} sx={{ mb: 7 }}>
        <EventDescription description={description} />
        <EventSchedule schedule={schedule} />
        <EventPerformers performerList={performerList} />
        <EventTerms eventTermsConditions={eventTermsConditions} />
      </Stack>
    </Paper>
  );
};

export default EventsTabPanel;
