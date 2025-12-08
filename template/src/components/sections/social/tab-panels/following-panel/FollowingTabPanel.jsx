import { useState } from 'react';
import Stack from '@mui/material/Stack';
import { profileData } from 'data/social';
import Follower from './Follower';

const FollowingTabPanel = () => {
  const [followingUsers, setFollowingUsers] = useState(profileData.followingUsers);

  const handleFollowStatus = (id) => {
    setFollowingUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, followingStatus: !user.followingStatus } : user,
      ),
    );
  };

  return (
    <Stack direction="column" spacing={4}>
      {followingUsers.map((user) => (
        <Follower key={user.id} user={user} handleFollowStatus={handleFollowStatus} />
      ))}
    </Stack>
  );
};

export default FollowingTabPanel;
