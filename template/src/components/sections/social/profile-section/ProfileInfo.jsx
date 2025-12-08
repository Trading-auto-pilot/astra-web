import Avatar, { avatarClasses } from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { profileData } from 'data/social';
import { formatNumber } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import ProfileActions from './ProfileActions';

const ProfileInfo = () => {
  return (
    <>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          mt: -9,
          width: 1,
          mb: 3,
          justifyContent: 'space-between',
          alignItems: { xs: 'center', sm: 'flex-end' },
        }}
      >
        <Avatar src={profileData.avatar} alt="profile-avatar" sx={{ width: 144, height: 144 }} />
        <ProfileActions />
      </Stack>
      <Stack direction="column" spacing={2} sx={{ mb: 4 }}>
        <div>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {profileData.name}{' '}
            <IconifyIcon
              icon="material-symbols:check-circle-rounded"
              sx={{ fontSize: 20, color: 'success.main' }}
            />
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', textWrap: 'pretty' }}>
            {profileData.bio}
          </Typography>
        </div>
        <div>
          <Stack spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
            <IconifyIcon icon="material-symbols:link-rounded" sx={{ fontSize: 20 }} />
            <Typography variant="body2" component={Link} href="#!">
              {profileData.websiteUrl}
            </Typography>
          </Stack>
          <Stack spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
            <IconifyIcon icon="material-symbols:link-rounded" sx={{ fontSize: 20 }} />
            <Typography variant="body2" component={Link} href="#!">
              {profileData.username}
            </Typography>
          </Stack>
          <Stack spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
            <IconifyIcon icon="material-symbols:mail-outline-rounded" sx={{ fontSize: 20 }} />
            <Typography variant="body2" component={Link} href={`mailto:${profileData.email}`}>
              {profileData.email}
            </Typography>
          </Stack>
        </div>
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} sx={{ mb: 4 }}>
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {profileData.following}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: 'text.secondary', fontWeight: 400, ml: 0.5 }}
            >
              Following
            </Typography>
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {formatNumber(profileData.followers)}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: 'text.secondary', fontWeight: 400, ml: 0.5 }}
            >
              Followers
            </Typography>
          </Typography>
        </Stack>
        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
        <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
          <AvatarGroup
            max={3}
            sx={{
              [`& .${avatarClasses.root}`]: {
                width: 24,
                height: 24,
                fontSize: 12,
                lineHeight: 'normal',
              },
            }}
          >
            {profileData.followingUsers.map((user) => (
              <Avatar key={user.id} alt={user.name} src={user.avatar} />
            ))}
          </AvatarGroup>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {profileData.followingUsers.slice(0, 2).map((user, index) => {
              if (index + 1 === 2) return user.name;

              return user.name + ', ';
            })}{' '}
            and {profileData.followingUsers.slice(2).length} others are following
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};

export default ProfileInfo;
