import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Box, Button, Stack } from '@mui/material';
import { convertFileToAttachment, generateUniqueId } from 'lib/utils';
import { useChatContext } from 'providers/ChatProvider';
import { SENT_MESSAGE, START_NEW_CONVERSATION } from 'reducers/ChatReducer';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import SimpleBar from 'components/base/SimpleBar';
import AttachmentPreview from 'components/sections/chat/conversation/main/content-footer/AttachmentPreview';
import TextInput from './TextInput';
import ChatControls from './controls/ChatControls';

const ContentFooter = ({ recipients }) => {
  const { chatDispatch, conversations, currentConversation } = useChatContext();
  const navigate = useNavigate();
  const methods = useForm();

  const { handleSubmit, reset, watch } = methods;

  const attachmentsValue = watch('attachments');
  const textValue = watch('text');

  const onSubmit = (data) => {
    const getAttachments = () => ({
      media: (data.attachments ?? [])
        .filter((a) => ['image', 'video', 'audio'].includes(a.type))
        .map(({ file }) => ({
          type: file.type.split('/')[0],
          src: URL.createObjectURL(file),
        })),
      files: (data.attachments ?? [])
        .filter((a) => a.type === 'file')
        .map(({ file }) => convertFileToAttachment(file)),
    });

    const payload = (conversationId) => ({
      conversationId,
      message: {
        text: data.text?.trim(),
        attachments: getAttachments(),
      },
    });

    if (!recipients?.length) {
      if (!currentConversation) return;
      chatDispatch({
        type: SENT_MESSAGE,
        payload: {
          ...payload(currentConversation.id),
        },
      });

      reset();

      return;
    }

    const existingConv =
      recipients.length === 1
        ? conversations.find(
            (c) => c.recipients.length === 1 && c.recipients[0].id === recipients[0].id,
          )
        : null;

    const conversationId = existingConv?.id || generateUniqueId();

    if (existingConv) {
      chatDispatch({
        type: SENT_MESSAGE,
        payload: {
          ...payload(conversationId),
        },
      });
    } else {
      chatDispatch({
        type: START_NEW_CONVERSATION,
        payload: {
          recipients,
          ...payload(conversationId),
        },
      });
    }

    navigate(paths.chatConversation(conversationId));
    reset();
  };

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        sx={{ zIndex: 2, bgcolor: 'background.default', px: { xs: 3, md: 5 }, py: 2 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack
          direction="column"
          gap={1.25}
          sx={{ p: 2, pb: 1, bgcolor: 'background.elevation2', borderRadius: 6 }}
        >
          <TextInput onSubmit={onSubmit} />

          {attachmentsValue && attachmentsValue.length > 0 && (
            <SimpleBar>
              <Stack gap={1} sx={{ py: 1 }}>
                {attachmentsValue.map((attachment, index) => (
                  <AttachmentPreview key={index} attachment={attachment} index={index} />
                ))}
              </Stack>
            </SimpleBar>
          )}

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1 }}>
            <ChatControls />

            <Button
              variant="contained"
              type="submit"
              disabled={
                (!textValue?.trim() && (!attachmentsValue || attachmentsValue.length === 0)) ||
                (recipients && recipients.length === 0)
              }
              endIcon={
                <IconifyIcon
                  icon="material-symbols:send-outline-rounded"
                  sx={{ fontSize: '20px !important' }}
                />
              }
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </FormProvider>
  );
};

export default ContentFooter;
