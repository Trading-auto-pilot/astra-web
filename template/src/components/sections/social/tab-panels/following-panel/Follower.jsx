import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { formatNumber } from 'lib/utils';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';

const Follower = ({ user, handleFollowStatus }) => {
  const { down } = useBreakpoints();
  const downSm = down('sm');

  return (
    <Stack key={user.id} spacing={2} sx={{ width: 1 }}>
      <Avatar src={user.avatar} alt="profile-avatar" sx={{ width: 48, height: 48 }} />
      <Stack sx={{ justifyContent: 'space-between', alignItems: 'flex-start', flexGrow: 1 }}>
        <Stack direction="column" sx={{ justifyContent: 'space-between', height: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {user.name}
          </Typography>
          <Stack spacing={{ xs: 1, sm: 2 }}>
            <Typography
              variant="body1"
              sx={{ fontSize: { xs: 'body2.fontSize', sm: 'unset' }, fontWeight: 700 }}
            >
              {user.following}
              <Typography
                component="span"
                variant="body1"
                sx={{
                  fontSize: { xs: 'body2.fontSize', sm: 'unset' },
                  color: 'text.secondary',
                  fontWeight: 400,
                  ml: 0.5,
                }}
              >
                Following
              </Typography>
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: { xs: 'body2.fontSize', sm: 'unset' }, fontWeight: 700 }}
            >
              {formatNumber(user.followers)}
              <Typography
                component="span"
                variant="body1"
                sx={{
                  fontSize: { xs: 'body2.fontSize', sm: 'unset' },
                  color: 'text.secondary',
                  fontWeight: 400,
                  ml: 0.5,
                }}
              >
                Followers
              </Typography>
            </Typography>
          </Stack>
        </Stack>
        <Button
          variant={user.followingStatus === true ? 'soft' : 'contained'}
          color="neutral"
          shape={downSm ? 'square' : undefined}
          onClick={() => handleFollowStatus(user.id)}
          sx={{ gap: 0.5 }}
        >
          <IconifyIcon
            icon={
              user.followingStatus
                ? 'material-symbols:person-check-outline-rounded'
                : 'material-symbols:person-add-outline-rounded'
            }
            sx={{ fontSize: 20, display: { xs: 'block', sm: 'none' } }}
          />
          <Box component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {user.followingStatus ? 'Following' : 'Follow'}
          </Box>
        </Button>
      </Stack>
    </Stack>
  );
};

export default Follower;
