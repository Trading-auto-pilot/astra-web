import { useState } from 'react';
import data from '@emoji-mart/data/sets/15/apple.json';
import Picker from '@emoji-mart/react';
import { Button, Popover, Tooltip, useTheme } from '@mui/material';
import IconifyIcon from './IconifyIcon';

const EmojiPicker = ({ handleEmojiSelect, actionButtonEle, ...rest }) => {
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const { direction } = useTheme();

  const onEmojiSelect = (emoji) => {
    if (handleEmojiSelect) {
      handleEmojiSelect(emoji.native);
    }
    setEmojiAnchorEl(null);
  };

  return (
    <>
      <div onClick={(e) => setEmojiAnchorEl(e.currentTarget)}>
        {actionButtonEle ? (
          actionButtonEle
        ) : (
          <Tooltip title="Emoji">
            <Button variant="contained" shape="square" color="primary">
              <IconifyIcon icon="material-symbols:mood-outline-rounded" fontSize={20} />
            </Button>
          </Tooltip>
        )}
      </div>

      <Popover
        open={!!emojiAnchorEl}
        onClose={() => setEmojiAnchorEl(null)}
        anchorEl={emojiAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: direction === 'rtl' ? 'right' : 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: direction === 'rtl' ? 'right' : 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              mt: -2,
            },
          },
        }}
        keepMounted
      >
        <Picker
          data={data}
          perLine={8}
          previewPosition="none"
          skinTonePosition="none"
          theme="light"
          onEmojiSelect={onEmojiSelect}
          {...rest}
        />
      </Popover>
    </>
  );
};

export default EmojiPicker;
