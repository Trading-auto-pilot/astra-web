import { useState } from 'react';
import Box from '@mui/material/Box';
import ToggleButton, { toggleButtonClasses } from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { formatNumber } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import SharePostDialog from '../../share-post/SharePostDialog';

const Actions = ({ engagement, toggleThreadInput }) => {
  const [liked, setLiked] = useState(false);

  return (
    <ToggleButtonGroup
      sx={{
        bgcolor: 'transparent',
        [`& .${toggleButtonClasses.root}`]: {
          minWidth: 0,
          gap: 0.5,
        },
        [`& .${toggleButtonClasses.root}, & .${toggleButtonClasses.selected}`]: {
          bgcolor: 'transparent !important',
          color: 'neutral.main',
        },
        [`& .${toggleButtonClasses.root}:hover, & .${toggleButtonClasses.selected}:hover, & .${toggleButtonClasses.root}.${toggleButtonClasses.selected}:hover`]:
          {
            bgcolor: (theme) => `${theme.vars.palette.background.elevation2} !important`,
            color: 'neutral.main',
          },
      }}
    >
      <ToggleButton
        value="like"
        selected={liked}
        size="small"
        disableRipple
        onChange={() => setLiked(!liked)}
      >
        <IconifyIcon
          icon={
            liked
              ? `material-symbols:favorite-rounded`
              : `material-symbols:favorite-outline-rounded`
          }
          sx={{ fontSize: 18, color: liked ? 'error.main' : 'neutral.main' }}
        />{' '}
        <Box component="span">
          {liked ? formatNumber(engagement.likes + 1) : formatNumber(engagement.likes)}
        </Box>
      </ToggleButton>

      <ToggleButton value="comment" onClick={toggleThreadInput} size="small" disableRipple>
        <IconifyIcon icon="material-symbols:mode-comment-outline-rounded" sx={{ fontSize: 18 }} />{' '}
        <Box component="span">{engagement.comments}</Box>
      </ToggleButton>

      {engagement.shares && <SharePostDialog shares={engagement.shares} />}
    </ToggleButtonGroup>
  );
};

export default Actions;
