import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { ButtonBase, Checkbox, Divider, IconButton, Stack, Tooltip } from '@mui/material';
import { useBulkSelect } from 'providers/BulkSelectProvider';
import { useEmailContext } from 'providers/EmailProvider';
import {
  ARCHIVE_EMAIL,
  DELETE_EMAIL,
  IMPORTANT_EMAIL,
  SNOOZE_EMAIL,
  STARRED_EMAIL,
} from 'reducers/EmailReducer';
import IconifyIcon from 'components/base/IconifyIcon';
import EmailListActionMenu from './EmailListActionMenu';

const EmailListActions = () => {
  const { handleToggleAll, isIndeterminate, isAllSelected, selectedIds } = useBulkSelect();
  const {
    emailState: { emails },
    emailDispatch,
  } = useEmailContext();
  const { label } = useParams();

  const starred = useMemo(() => {
    return (
      emails.filter((email) => selectedIds.includes(email.id)).every((email) => email.starred) &&
      selectedIds.length > 0
    );
  }, [emails, selectedIds]);

  const important = useMemo(() => {
    return (
      emails.filter((email) => selectedIds.includes(email.id)).every((email) => email.important) &&
      selectedIds.length > 0
    );
  }, [emails, selectedIds]);

  const snoozed = useMemo(() => {
    return (
      emails
        .filter((email) => selectedIds.includes(email.id))
        .every((email) => email.snoozedTill !== null) && selectedIds.length > 0
    );
  }, [emails, selectedIds]);

  useEffect(() => {
    handleToggleAll(false);
  }, [label]);

  return (
    <Stack>
      <Tooltip title="Select">
        <Checkbox
          sx={{ p: '7px' }}
          onChange={(e) => handleToggleAll(e.target.checked)}
          checked={isAllSelected}
          indeterminate={isIndeterminate ? true : undefined}
        />
      </Tooltip>
      <Tooltip title={starred ? 'Remove star' : 'Add star'}>
        <IconButton
          component={ButtonBase}
          size="small"
          onClick={() =>
            emailDispatch({
              type: STARRED_EMAIL,
              payload: { ids: selectedIds, starred: !starred },
            })
          }
          disabled={!selectedIds.length}
        >
          <IconifyIcon
            icon={
              starred
                ? 'material-symbols:star-rate-rounded'
                : 'material-symbols:star-rate-outline-rounded'
            }
            sx={[
              {
                fontSize: 20,
                color: 'text.primary',
              },
              starred && { color: 'warning.main' },
              !selectedIds.length && { color: 'text.disabled' },
            ]}
          />
        </IconButton>
      </Tooltip>
      <Tooltip title={important ? 'Mark as not important' : 'Mark as important'}>
        <IconButton
          size="small"
          component={ButtonBase}
          onClick={() =>
            emailDispatch({
              type: IMPORTANT_EMAIL,
              payload: { ids: selectedIds, important: !important },
            })
          }
          disabled={!selectedIds.length}
        >
          <IconifyIcon
            icon={
              important
                ? 'material-symbols:label-important-rounded'
                : 'material-symbols:label-important-outline-rounded'
            }
            sx={[
              {
                fontSize: 20,
                color: 'text.primary',
              },
              important && { color: 'warning.main' },
              !selectedIds.length && { color: 'text.disabled' },
            ]}
          />
        </IconButton>
      </Tooltip>
      <Tooltip title={snoozed ? 'Unsnooze' : 'Snooze for 1 day'}>
        <IconButton
          size="small"
          component={ButtonBase}
          onClick={() =>
            emailDispatch({
              type: SNOOZE_EMAIL,
              payload: { ids: selectedIds, snoozed: !snoozed },
            })
          }
          disabled={!selectedIds.length}
        >
          <IconifyIcon
            icon="material-symbols:snooze-outline-rounded"
            sx={{
              fontSize: 20,
              color: !selectedIds.length ? 'text.disabled' : 'text.primary',
            }}
          />
        </IconButton>
      </Tooltip>
      <Tooltip title="Archive">
        <IconButton
          size="small"
          component={ButtonBase}
          onClick={() => emailDispatch({ type: ARCHIVE_EMAIL, payload: selectedIds })}
          disabled={!selectedIds.length}
          sx={[(label === 'trash' || label === 'archived') && { display: 'none' }]}
        >
          <IconifyIcon
            icon="material-symbols:archive-outline-rounded"
            sx={{
              fontSize: 20,
              color: !selectedIds.length ? 'text.disabled' : 'text.primary',
            }}
          />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          size="small"
          component={ButtonBase}
          onClick={() => emailDispatch({ type: DELETE_EMAIL, payload: selectedIds })}
          disabled={!selectedIds.length}
          sx={[label === 'trash' && { display: 'none' }]}
        >
          <IconifyIcon
            icon="material-symbols:delete-outline-rounded"
            sx={{
              fontSize: 20,
              color: !selectedIds.length ? 'text.disabled' : 'text.primary',
            }}
          />
        </IconButton>
      </Tooltip>
      <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 2 }} />
      <EmailListActionMenu />
    </Stack>
  );
};

export default EmailListActions;
