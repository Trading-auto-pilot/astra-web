import { useFormContext } from 'react-hook-form';
import { Button, Tooltip } from '@mui/material';
import EmojiPicker from 'components/base/EmojiPicker';
import IconifyIcon from 'components/base/IconifyIcon';

const ChatEmojiPicker = () => {
  const { setValue, watch } = useFormContext();

  const currentText = watch('text') || '';

  const handleEmojiSelect = (native) => {
    setValue('text', currentText + native);
  };

  return (
    <EmojiPicker
      handleEmojiSelect={handleEmojiSelect}
      actionButtonEle={
        <Tooltip title="Emoji">
          <Button shape="square" color="neutral">
            <IconifyIcon icon="material-symbols:mood-outline-rounded" fontSize={20} />
          </Button>
        </Tooltip>
      }
    />
  );
};

export default ChatEmojiPicker;
