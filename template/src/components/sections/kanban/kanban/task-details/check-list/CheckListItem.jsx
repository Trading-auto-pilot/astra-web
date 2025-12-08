import Avatar, { avatarClasses } from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText, { listItemTextClasses } from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import IconifyIcon from 'components/base/IconifyIcon';

dayjs.extend(advancedFormat);

const CheckListItem = ({ data, isLastItem, handleChecklistUpdate }) => {
  return (
    <>
      <ListItem
        key={data.id}
        component="div"
        secondaryAction={
          <Button
            shape="square"
            variant="text"
            size="small"
            color="neutral"
            aria-label={`action-btn-${data.id}`}
            disabled={data.checked}
          >
            <IconifyIcon icon="material-symbols:more-vert" fontSize={18} />
          </Button>
        }
        sx={{ minWidth: 540 }}
        disableGutters
        disablePadding
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={data.checked}
            onChange={() => handleChecklistUpdate(data.id)}
            disableRipple
            slotProps={{
              input: {
                'aria-labelledby': `checkbox-list-label-${data.id}`,
              },
            }}
            sx={{ ml: -1 }}
          />
        </ListItemIcon>
        <ListItemButton
          role={undefined}
          sx={{ px: 0, cursor: 'unset', '&:hover': { bgcolor: 'transparent' } }}
          disabled={data.checked}
          disableRipple
          dense
        >
          <ListItemText
            primary={data.title}
            sx={{
              flex: 3,
              color: 'text.primary',
              cursor: 'pointer',
              [`& .${listItemTextClasses.primary}`]: { fontWeight: 500 },
            }}
            onClick={() => handleChecklistUpdate(data.id)}
          />

          <AvatarGroup
            max={4}
            color="primary"
            sx={{
              mr: 2,
              flex: 2,
              alignItems: 'center',
              [`& .${avatarClasses.root}`]: {
                width: 30,
                height: 30,
                fontWeight: 'medium',
                bgcolor: 'primary.main',
              },
            }}
          >
            {data.assignee.map((user) => (
              <Tooltip title={user.name} key={user.name}>
                <Avatar alt={user.name} src={user.avatar} />
              </Tooltip>
            ))}

            <Button variant="contained" shape="circle" size="small" sx={{ zIndex: 1000 }}>
              <IconifyIcon icon="material-symbols:group-add-outline" fontSize={18} />
            </Button>
          </AvatarGroup>

          <ListItemText
            sx={{
              flex: 2.5,
              color: 'text.primary',
              textAlign: 'right',
            }}
          >
            {dayjs(data.time).format('Do MMM, h:mm A')}
          </ListItemText>
        </ListItemButton>
      </ListItem>
      {!isLastItem && <Divider sx={{ minWidth: 540 }} />}
    </>
  );
};

export default CheckListItem;
