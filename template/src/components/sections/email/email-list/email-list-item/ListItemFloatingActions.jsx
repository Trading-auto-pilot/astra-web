import { useParams } from 'react-router';
import { ButtonBase, IconButton, Stack, Tooltip } from '@mui/material';
import { useEmailContext } from 'providers/EmailProvider';
import {
  ARCHIVE_EMAIL,
  DELETE_EMAIL,
  SNOOZE_EMAIL,
  UPDATE_MESSAGE_STATUS,
} from 'reducers/EmailReducer';
import IconifyIcon from 'components/base/IconifyIcon';

const ListItemFloatingActions = ({ email }) => {
  const { label, id } = useParams();
  const { emailDispatch, resizableWidth } = useEmailContext();

  const preventDefaultBehaviour = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Stack
      className="actions"
      onClick={preventDefaultBehaviour}
      onMouseDown={preventDefaultBehaviour}
      sx={[
        {
          alignItems: 'center',
          bgcolor: 'action.hover',
          position: 'absolute',
          right: 16,
          height: 1,
          pl: 2,
          opacity: 0,
          display: { xs: 'none', sm: 'flex' },
        },
        !!id &&
          resizableWidth < 500 && {
            height: 'auto',
            top: 16,
          },
      ]}
    >
      <Tooltip title="Delete">
        <IconButton
          size="small"
          component={ButtonBase}
          onClick={() => emailDispatch({ type: DELETE_EMAIL, payload: [email.id] })}
          disabled={label === 'trash'}
          sx={{
            fontSize: 20,
            color: label === 'trash' ? 'text.disabled' : 'text.secondary',
            '&:hover': {
              color: 'text.primary',
            },
          }}
        >
          <IconifyIcon icon="material-symbols:delete-outline-rounded" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Archive">
        <IconButton
          size="small"
          component={ButtonBase}
          onClick={() => emailDispatch({ type: ARCHIVE_EMAIL, payload: [email.id] })}
          disabled={label === 'trash' || label === 'archived'}
          sx={[
            {
              fontSize: 20,
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
              },
            },
            (label === 'trash' || label === 'archived') && { color: 'text.disabled' },
          ]}
        >
          <IconifyIcon icon="material-symbols:archive-outline-rounded" />
        </IconButton>
      </Tooltip>
      <Tooltip title={email.snoozedTill === null ? 'Snooze for 1 day' : 'Unsnooze'}>
        <IconButton
          size="small"
          onClick={() => emailDispatch({ type: SNOOZE_EMAIL, payload: { ids: [email.id] } })}
          sx={{
            fontSize: 20,
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
            },
          }}
        >
          <IconifyIcon icon="material-symbols:snooze-outline-rounded" />
        </IconButton>
      </Tooltip>
      <Tooltip title={email.readAt === null ? 'Mark as read' : 'Mark as unread'}>
        <IconButton
          size="small"
          onClick={() =>
            emailDispatch({ type: UPDATE_MESSAGE_STATUS, payload: { ids: [email.id] } })
          }
          sx={{
            fontSize: 20,
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
            },
          }}
        >
          <IconifyIcon
            icon={
              email.readAt === null
                ? 'material-symbols:mark-email-read-outline-rounded'
                : 'material-symbols:mark-email-unread-outline'
            }
          />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default ListItemFloatingActions;
