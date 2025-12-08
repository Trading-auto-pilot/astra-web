import { useState } from 'react';
import { TabContext, TabList } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import { users } from 'data/users';
import CurrentTeamTabPanel from 'components/sections/kanban/create-board/steps/TeamInvite/CurrentTeamTabPanel';
import NewTeamTabPanel from 'components/sections/kanban/create-board/steps/TeamInvite/NewTeamTabPanel';

const TeamInvite = () => {
  const [currentTab, setCurrentTab] = useState('new');

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <TabContext value={currentTab}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="team management tab panel">
          <Tab label="Your Current Teams" value="current" />
          <Tab label="Create New Team" value="new" />
        </TabList>
      </Box>
      <CurrentTeamTabPanel value="current" />
      <NewTeamTabPanel value="new" options={users} />
    </TabContext>
  );
};

export default TeamInvite;
