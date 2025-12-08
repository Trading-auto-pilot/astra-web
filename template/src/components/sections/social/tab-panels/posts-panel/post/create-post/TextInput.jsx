import { useFormContext } from 'react-hook-form';
import { inputBaseClasses } from '@mui/material';
import Stack from '@mui/material/Stack';
import SimpleBar from 'components/base/SimpleBar';
import AttachmentPreview from 'components/sections/chat/conversation/main/content-footer/AttachmentPreview';
import StyledTextField from 'components/styled/StyledTextField';

const TextInput = () => {
  const { register, watch } = useFormContext();
  const attachmentsValue = watch('attachments');

  return (
    <Stack direction="column" sx={{ bgcolor: 'background.elevation2', borderRadius: 1 }}>
      <StyledTextField
        id="filled-multiline-flexible"
        placeholder="What's on your mind?"
        multiline
        minRows={3}
        maxRows={4}
        size="small"
        {...register('text')}
        sx={{
          [`& .${inputBaseClasses.root}`]: {
            py: 0,
            bgcolor: 'transparent',
            '&:hover': { bgcolor: 'transparent' },
            [`&.${inputBaseClasses.focused}`]: {
              boxShadow: 'none',
              bgcolor: 'transparent',
            },
          },
        }}
      />
      {attachmentsValue && attachmentsValue.length > 0 && (
        <SimpleBar>
          <Stack gap={1} sx={{ py: 0.75, px: 1.5 }}>
            {attachmentsValue.map((attachment, index) => (
              <AttachmentPreview key={index} attachment={attachment} index={index} />
            ))}
          </Stack>
        </SimpleBar>
      )}
    </Stack>
  );
};

export default TextInput;
