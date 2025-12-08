import { useNavigate, useParams } from 'react-router';
import { ButtonBase, IconButton, Stack, Tooltip } from '@mui/material';
import { useEmailContext } from 'providers/EmailProvider';
import {
  ARCHIVE_EMAIL,
  DELETE_EMAIL,
  IMPORTANT_EMAIL,
  SNOOZE_EMAIL,
  STARRED_EMAIL,
} from 'reducers/EmailReducer';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import CardHeaderAction from 'components/common/CardHeaderAction';
import EmailDetailsActionMenu from './EmailDetailsActionMenu';

const EmailDetailsHeader = () => {
  const navigate = useNavigate();
  const { label } = useParams();
  const {
    emailState: { email },
    emailDispatch,
  } = useEmailContext();

  return (
    <CardHeaderAction>
      <Stack>
        <IconButton
          onClick={() => navigate(paths.emailLabel(label))}
          sx={{ ml: { lg: 'auto' }, order: { lg: 1 } }}
        >
          <IconifyIcon
            icon="material-symbols:close-rounded"
            sx={{
              fontSize: 20,
              color: 'text.primary',
              display: { xs: 'none', lg: 'inline-block' },
            }}
          />
          <IconifyIcon
            icon="material-symbols:arrow-back-rounded"
            sx={{ fontSize: 20, color: 'text.primary', display: { lg: 'none' } }}
          />
        </IconButton>
        <Tooltip
          title={email?.starred ? 'Remove star' : 'Add star'}
          sx={{ ml: { xs: 'auto', lg: 0 } }}
        >
          <IconButton
            onClick={() =>
              emailDispatch({
                type: STARRED_EMAIL,
                payload: { ids: [email.id], starred: !email?.starred },
              })
            }
          >
            <IconifyIcon
              icon={
                email.starred
                  ? 'material-symbols:star-rate-rounded'
                  : 'material-symbols:star-rate-outline-rounded'
              }
              sx={{ fontSize: 20, color: email.starred ? 'warning.main' : 'text.primary' }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title={email?.important ? 'Mark as not important' : 'Mark as important'}>
          <IconButton
            onClick={() =>
              emailDispatch({
                type: IMPORTANT_EMAIL,
                payload: { ids: [email.id], important: !email?.important },
              })
            }
          >
            <IconifyIcon
              icon={
                email.important
                  ? 'material-symbols:label-important-rounded'
                  : 'material-symbols:label-important-outline-rounded'
              }
              sx={{ fontSize: 20, color: email.important ? 'warning.main' : 'text.primary' }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title={email?.snoozedTill ? 'Unsnooze' : 'Snooze for 1 day'}>
          <IconButton
            onClick={() => emailDispatch({ type: SNOOZE_EMAIL, payload: { ids: [email.id] } })}
          >
            <IconifyIcon
              icon="material-symbols:snooze-outline-rounded"
              sx={{ fontSize: 20, color: 'text.primary' }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Archive">
          <IconButton
            component={ButtonBase}
            onClick={() => emailDispatch({ type: ARCHIVE_EMAIL, payload: [email.id] })}
            sx={{
              display: label === 'trash' || label === 'archived' ? 'none' : 'inline-flex',
            }}
          >
            <IconifyIcon
              icon="material-symbols:archive-outline-rounded"
              sx={{ fontSize: 20, color: 'text.primary' }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            component={ButtonBase}
            onClick={() => emailDispatch({ type: DELETE_EMAIL, payload: [email.id] })}
            sx={{ display: label === 'trash' ? 'none' : 'inline-flex' }}
          >
            <IconifyIcon
              icon="material-symbols:delete-outline-rounded"
              sx={{ fontSize: 20, color: 'text.primary' }}
            />
          </IconButton>
        </Tooltip>
        <EmailDetailsActionMenu />
      </Stack>
    </CardHeaderAction>
  );
};

export default EmailDetailsHeader;
