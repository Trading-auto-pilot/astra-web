import { useState } from 'react';
import { Avatar, Button, Link, Stack } from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { profileData } from 'data/social';
import { useSnackbar } from 'notistack';
import StyledTextField from 'components/styled/StyledTextField';

const ThreadInput = ({ sx, placeholder = 'Comment to this post...', toggleThreadInput }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [text, setText] = useState('');

  return (
    <Stack
      spacing={2}
      className="comment"
      sx={{
        py: 1,
        position: 'relative',
        ...sx,
      }}
    >
      <Avatar
        component={Link}
        href="#!"
        src={profileData.avatar}
        alt="comment-author-avatar"
        sx={{ width: 32, height: 32, color: 'unset' }}
      />
      <Stack direction="column" spacing={2} sx={{ flexGrow: 1 }}>
        <StyledTextField
          id="filled-multiline-flexible"
          placeholder={placeholder}
          multiline
          value={text}
          onChange={(e) => setText(e.target.value)}
          minRows={3}
          maxRows={4}
          size="small"
          sx={{
            [`& .${inputBaseClasses.root}`]: {
              py: 0,
              bgcolor: 'background.elevation2',
              '&:hover': { bgcolor: 'background.elevation2' },
              [`&.${inputBaseClasses.focused}`]: {
                boxShadow: 'none',
                bgcolor: 'background.elevation2',
              },
            },
          }}
        />
        <Stack spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <Button
            color="neutral"
            onClick={() => {
              setText('');
              toggleThreadInput();
            }}
          >
            Discard
          </Button>
          <Button
            variant="contained"
            disabled={text.trim().length === 0}
            onClick={() => {
              enqueueSnackbar('Comment added!', { variant: 'success', autoHideDuration: 3000 });
              toggleThreadInput();
            }}
          >
            Comment
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ThreadInput;
