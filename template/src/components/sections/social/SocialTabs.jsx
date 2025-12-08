import { useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import FollowingTabPanel from './tab-panels/following-panel/FollowingTabPanel';
import PhotosTabPanel from './tab-panels/photos-panel/PhotosTabPanel';
import PostsTabPanel from './tab-panels/posts-panel/PostsTabPanel';

const SocialTabs = () => {
  const [currentTab, setCurrentTab] = useState('posts');

  const handleChange = (_, newValue) => setCurrentTab(newValue);

  return (
    <TabContext value={currentTab}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <TabList onChange={handleChange}>
          <Tab label="Posts" value="posts" />
          <Tab label="Photos" value="photos" />
          <Tab label="Following" value="following" />
        </TabList>
      </Box>

      <TabPanel value="posts" sx={{ p: 0 }}>
        <PostsTabPanel />
      </TabPanel>
      <TabPanel value="photos" sx={{ p: 0 }}>
        <PhotosTabPanel />
      </TabPanel>
      <TabPanel value="following" sx={{ p: 0 }}>
        <FollowingTabPanel />
      </TabPanel>
    </TabContext>
  );
};

export default SocialTabs;
