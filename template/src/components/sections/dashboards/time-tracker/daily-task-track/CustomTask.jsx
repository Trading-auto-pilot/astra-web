import Avatar, { avatarClasses } from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const CustomTask = ({ task, vars, direction }) => {
  return (
    <Box
      sx={{
        px: 2,
        py: 2.5,
        width: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="subtitle2"
        title={task.label}
        sx={{ maxWidth: '70%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {task.label}
      </Typography>
      <AvatarGroup
        max={3}
        sx={{
          flexDirection: direction === 'ltr' ? 'row-reverse' : 'row',
          [`& .${avatarClasses.root}`]: {
            width: 24,
            height: 24,
            borderColor: vars.palette.background.default,
          },
          [`& .${avatarClasses.colorDefault}`]: {
            bgcolor: `${vars.palette.primary.main} !important`,
          },
        }}
      >
        {task.assignees.map((user) => (
          <Avatar key={user.id} alt={user.name} src={user.avatar} />
        ))}
      </AvatarGroup>
    </Box>
  );
};

export default CustomTask;
