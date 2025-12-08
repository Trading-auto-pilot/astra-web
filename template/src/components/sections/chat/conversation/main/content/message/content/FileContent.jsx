import MessageWrapper from '../MessageWrapper';
import FileMessage from '../formats/FileMessage';

const FileContent = ({ message }) => {
  const { attachments } = message;
  if (!attachments?.files?.length) return null;

  return (
    <MessageWrapper key="files" message={message} sx={{ p: 0, bgcolor: 'transparent' }}>
      <FileMessage messageType={message.type} files={attachments.files} />
    </MessageWrapper>
  );
};

export default FileContent;
