import { useFormContext, useWatch } from 'react-hook-form';
import { inputBaseClasses } from '@mui/material';
import StyledTextField from 'components/styled/StyledTextField';

const isOnlyEmojis = (text) => {
  const emojiRegex = /^(?:\p{Emoji_Presentation}|\p{Emoji_Modifier}|\p{Emoji_Modifier_Base}|\s)+$/u;

  return emojiRegex.test(text.trim()) && /\p{Emoji_Presentation}/u.test(text);
};

const TextInput = ({ onSubmit }) => {
  const { register, control, handleSubmit } = useFormContext();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const textValue = useWatch({ control, name: 'text' });

  return (
    <StyledTextField
      fullWidth
      multiline
      maxRows={3}
      placeholder="Write a message"
      {...register('text')}
      onKeyDown={handleKeyDown}
      sx={{
        [`& .${inputBaseClasses.root}`]: {
          py: 0.5,
          '&:hover': { bgcolor: 'transparent' },
          [`&.${inputBaseClasses.focused}`]: { boxShadow: 'none', bgcolor: 'transparent' },
          [`& .${inputBaseClasses.input}`]: {
            py: 0.5,
            px: '10px !important',
            fontSize: isOnlyEmojis(textValue || '') ? 'h2.fontSize' : 'unset',
            lineHeight: isOnlyEmojis(textValue || '') ? 1.2 : 'unset',
          },
        },
      }}
    />
  );
};

export default TextInput;
