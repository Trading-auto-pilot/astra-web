import { useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { activityMonitoringData } from 'data/crm/deal-details';
import AllActivitiesTabPanel from './activity-tab-panels/all-activities';
import CallLogTabPanel from './activity-tab-panels/call-log';
import EmailTabPanel from './activity-tab-panels/email';
import MeetingTabPanel from './activity-tab-panels/meeting';
import NotesTabPanel from './activity-tab-panels/notes';
import TaskTabPanel from './activity-tab-panels/tasks';

export const ActivityTab = {
  Activities: 'Activities',
  Email: 'Email',
  Meeting: 'Meeting',
  CallLog: 'Call log',
  Task: 'Task',
  Notes: 'Notes',
};
const ActivityTabs = () => {
  const [activeTab, setActiveTab] = useState(ActivityTab.Activities);

  const handleChange = (_event, newValue) => setActiveTab(newValue);

  return (
    <TabContext value={activeTab}>
      <Tabs
        onChange={handleChange}
        value={activeTab}
        variant="scrollable"
        scrollButtons={true}
        allowScrollButtonsMobile
        sx={{
          [`& .${tabsClasses.root}`]: {
            scrollMarginTop: '0 !important',
            WebkitTapHighlightColor: 'transparent',
          },
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        <Tab label={ActivityTab.Activities} value={ActivityTab.Activities} />
        <Tab label={ActivityTab.Email} value={ActivityTab.Email} />
        <Tab label={ActivityTab.Meeting} value={ActivityTab.Meeting} />
        <Tab label={ActivityTab.CallLog} value={ActivityTab.CallLog} />
        <Tab label={ActivityTab.Task} value={ActivityTab.Task} />
        <Tab label={ActivityTab.Notes} value={ActivityTab.Notes} />
      </Tabs>
      <TabPanel value={ActivityTab.Activities} sx={{ px: 0, pb: 0 }}>
        <AllActivitiesTabPanel allActivities={activityMonitoringData.allActivities} />
      </TabPanel>
      <TabPanel value={ActivityTab.Email} sx={{ px: 0, pb: 0 }}>
        <EmailTabPanel emailData={activityMonitoringData.email} />
      </TabPanel>
      <TabPanel value={ActivityTab.Meeting} sx={{ px: 0, pb: 0 }}>
        <MeetingTabPanel meetingData={activityMonitoringData.meeting} />
      </TabPanel>
      <TabPanel value={ActivityTab.CallLog} sx={{ px: 0, pb: 0 }}>
        <CallLogTabPanel callLogData={activityMonitoringData.callLog} />
      </TabPanel>
      <TabPanel value={ActivityTab.Task} sx={{ px: 0, pb: 0 }}>
        <TaskTabPanel tasksData={activityMonitoringData.tasks} />
      </TabPanel>
      <TabPanel value={ActivityTab.Notes} sx={{ px: 0, pb: 0 }}>
        <NotesTabPanel notes={activityMonitoringData.notes} />
      </TabPanel>
    </TabContext>
  );
};

export default ActivityTabs;
