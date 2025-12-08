import { useState } from 'react';
import { Box, Collapse } from '@mui/material';
import ContentBlock from './common/content-block/ContentBlock';
import ThreadConnector from './common/thread-connector/ThreadConnector';
import ThreadToggle from './common/thread-toggle/ThreadToggle';

const ReplyThread = ({ replies, isLastComment, toggleThreadInput }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);

  if (replies.length === 0) return null;

  return (
    <>
      <Box sx={{ position: 'relative', pl: 11 }}>
        {!isLastComment && <ThreadConnector offsetLeft={16} />}
        {open && <ThreadConnector offsetLeft={64} />}
        <ThreadConnector offsetLeft={64} elbow sx={{ top: -12 }} />
        <ThreadToggle handleToggle={toggle}>
          {open ? 'Hide all replies' : `View ${replies.length} more replies`}
        </ThreadToggle>
      </Box>

      <Collapse in={open} mountOnEnter unmountOnExit>
        <div>
          {replies.map((reply, i) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              isLastReply={i === replies.length - 1}
              isLastComment={isLastComment}
              isRepliesThreadOpen={open}
              toggleThreadInput={toggleThreadInput}
            />
          ))}
        </div>
      </Collapse>
    </>
  );
};

const ReplyItem = ({
  reply,
  isLastReply,
  isLastComment,
  isRepliesThreadOpen,
  toggleThreadInput,
}) => {
  return (
    <Box sx={{ position: 'relative', pl: 12 }}>
      {!isLastComment && <ThreadConnector offsetLeft={16} sx={{ bottom: 0 }} />}
      {isRepliesThreadOpen && (
        <>
          {!isLastReply && <ThreadConnector offsetLeft={64} />}
          <ThreadConnector offsetLeft={64} elbow />
        </>
      )}
      <ContentBlock content={reply} toggleThreadInput={toggleThreadInput} />
    </Box>
  );
};

export default ReplyThread;
