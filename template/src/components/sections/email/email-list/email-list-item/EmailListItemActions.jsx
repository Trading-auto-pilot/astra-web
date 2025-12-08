import { useParams } from 'react-router';
import { Checkbox, IconButton, Stack, Tooltip } from '@mui/material';
import { useBulkSelect } from 'providers/BulkSelectProvider';
import { useEmailContext } from 'providers/EmailProvider';
import { IMPORTANT_EMAIL, STARRED_EMAIL } from 'reducers/EmailReducer';
import IconifyIcon from 'components/base/IconifyIcon';
import CardHeaderAction from 'components/common/CardHeaderAction';

const EmailListItemActions = ({ email }) => {
  const { selectedIds, handleToggleCheck } = useBulkSelect();
  const { emailDispatch, resizableWidth } = useEmailContext();
  const { id } = useParams();

  const preventDefaultBehaviour = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <CardHeaderAction sx={{ mx: '-6px', mr: 0 }}>
      <Stack
        sx={[{ mr: 2, alignItems: 'center', mb: 1 }, (!id || resizableWidth > 500) && { mb: 0 }]}
      >
        <Tooltip title="Select">
          <Checkbox
            size="small"
            checked={selectedIds.includes(email.id)}
            onChange={() => {
              handleToggleCheck(email.id);
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            sx={{ p: 0.9 }}
          />
        </Tooltip>
        <Tooltip title={email.starred ? 'Starred' : 'Not Starred'}>
          <IconButton
            size="small"
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            onClick={(e) => {
              emailDispatch({
                type: STARRED_EMAIL,
                payload: { ids: [email.id], starred: !email.starred },
              });
              preventDefaultBehaviour(e);
            }}
            onMouseDown={preventDefaultBehaviour}
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
        <Tooltip title={email.important ? 'Important' : 'Not Important'}>
          <IconButton
            size="small"
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            onClick={(e) => {
              emailDispatch({
                type: IMPORTANT_EMAIL,
                payload: { ids: [email.id], important: !email.important },
              });
              preventDefaultBehaviour(e);
            }}
            onMouseDown={preventDefaultBehaviour}
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
      </Stack>
    </CardHeaderAction>
  );
};

export default EmailListItemActions;
