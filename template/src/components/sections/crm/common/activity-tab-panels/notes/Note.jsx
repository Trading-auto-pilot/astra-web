import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';
import CRMDropdownMenu from '../../CRMDropdownMenu';

const Note = ({ note }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <Stack gap={2} sx={{ py: 3 }}>
      <Avatar src={note.author.avatar} sx={{ width: 48, height: 48 }} />
      <Stack direction="column" gap={2}>
        <Stack gap={1} sx={{ justifyContent: 'space-between' }}>
          <Stack direction="column" gap={1}>
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: '18px' }}>
              Added by <strong>{note.author.name}</strong> at{' '}
              {dayjs(note.createdAt).format('DD MMM, YYYY h:mm a')}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {note.title}
            </Typography>
          </Stack>
          <Stack gap={1}>
            <Button
              size="small"
              shape="square"
              color="neutral"
              variant="soft"
              sx={{ borderRadius: 1 }}
            >
              <IconifyIcon icon="material-symbols:edit-outline" sx={{ fontSize: 18 }} />
            </Button>
            <Button
              size="small"
              shape="square"
              color="neutral"
              variant="soft"
              onClick={(event) => setAnchorEl(event.currentTarget)}
              sx={{ borderRadius: 1 }}
            >
              <IconifyIcon icon="material-symbols:more-vert" sx={{ fontSize: 18 }} />
            </Button>
            <CRMDropdownMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              handleClose={() => setAnchorEl(null)}
            />
          </Stack>
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {note.description}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Note;
