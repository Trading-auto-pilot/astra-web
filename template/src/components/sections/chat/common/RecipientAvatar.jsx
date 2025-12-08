import { Avatar, AvatarGroup, badgeClasses } from '@mui/material';
import OutlinedBadge from 'components/styled/OutlinedBadge';

const RecipientAvatar = ({ recipients, avatarStyles, badgeStyles }) => {
  const recipientsArray = Array.isArray(recipients) ? recipients : [recipients];
  const isGroup = recipientsArray.length > 1;

  const renderSingleAvatar = (recipient) => (
    <Avatar
      alt={recipient.name}
      src={recipient.avatar}
      sx={{ width: 24, height: 24, ...avatarStyles }}
    />
  );

  const renderGroupAvatars = (group) => (
    <AvatarGroup max={2} sx={{ width: 48, flexDirection: 'row', ...avatarStyles }}>
      {group.slice(0, 2).map((user, index) => (
        <Avatar
          key={user.id}
          alt={user.name}
          src={user.avatar}
          sx={{
            height: '66.67%',
            width: '66.67%',
            border: 'none !important',
            zIndex: `${2 - index} !important`,
            mr: index === 1 ? '-35% !important' : 0,
            mt: index === 0 ? '30%' : 0,
          }}
        />
      ))}
    </AvatarGroup>
  );

  return (
    <OutlinedBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      color="success"
      sx={{
        [`& .${badgeClasses.badge}`]: {
          display:
            isGroup || (recipientsArray.length === 1 && recipientsArray[0].status === 'offline')
              ? 'none'
              : 'block',
          height: 8,
          width: 8,
          borderRadius: '50%',
          border: 1,
          borderColor: 'background.paper',
          ...badgeStyles,
        },
      }}
    >
      {isGroup ? renderGroupAvatars(recipientsArray) : renderSingleAvatar(recipientsArray[0])}
    </OutlinedBadge>
  );
};

export default RecipientAvatar;
