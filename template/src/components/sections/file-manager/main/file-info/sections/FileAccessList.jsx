import { useState } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import StatusAvatar from 'components/base/StatusAvatar';
import StyledTextField from 'components/styled/StyledTextField';

const SharedUser = ({ share }) => {
  const [permission, setPermission] = useState(share.permission);

  const handlePermissionChange = (event) => setPermission(event.target.value);

  return (
    <Stack gap={2}>
      <StatusAvatar
        src={share.user.avatar}
        status={share.user.status === 'online' ? 'online' : 'offline'}
        sx={{ height: 40, width: 40 }}
      />
      <Stack gap={2} sx={{ alignItems: 'center', justifyContent: 'space-between', flexGrow: 1 }}>
        <Stack direction="column" gap={0.5}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {share.user.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {share.user.email.split('.')[0] + '@' + share.user.email.split('@')[1]}
          </Typography>
        </Stack>
        <StyledTextField
          select
          fullWidth
          value={permission}
          size="small"
          onChange={handlePermissionChange}
          sx={{ maxWidth: 104 }}
        >
          <MenuItem value="owner">Owner</MenuItem>
          <MenuItem value="viewer">Can View</MenuItem>
          <MenuItem value="editor">Can Edit</MenuItem>
        </StyledTextField>
      </Stack>
    </Stack>
  );
};

const FileAccessList = ({ file }) => {
  return (
    <Paper background={1} sx={{ p: { xs: 3, md: 5 } }}>
      <Stack direction="column" gap={3}>
        <Stack gap={2} sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Who has access</Typography>
          <Button size="small" color="neutral">
            Manage Access
          </Button>
        </Stack>
        <Stack direction="column" gap={2}>
          {file.shared.map((share) => (
            <SharedUser key={share.id} share={share} />
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default FileAccessList;
