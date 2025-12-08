import { useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab } from '@mui/material';
import CandidateDocuments from './CandidateDocuments';
import Notes from './Notes';
import Questionaries from './questionaries';
import Scorecard from './scrorecard';

const CandidateDetailsMain = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => setValue(newValue);

  return (
    <Stack direction="column" sx={{ height: 1 }}>
      <TabContext value={value}>
        <TabList onChange={handleChange}>
          <Tab label="Documents" value="1" />
          <Tab label="Questionaries" value="2" />
          <Tab label="Notes" value="3" />
          <Tab label="Scorecard" value="4" />
        </TabList>

        <TabPanel sx={{ p: 0, pt: 5, height: 1 }} value="1">
          <CandidateDocuments />
        </TabPanel>
        <TabPanel sx={{ p: 0, pt: 5, height: 1 }} value="2">
          <Questionaries />
        </TabPanel>
        <TabPanel sx={{ p: 0, pt: 5, height: 1 }} value="3">
          <Notes />
        </TabPanel>
        <TabPanel sx={{ p: 0, pt: 5, height: 1 }} value="4">
          <Scorecard />
        </TabPanel>
      </TabContext>
    </Stack>
  );
};

export default CandidateDetailsMain;
