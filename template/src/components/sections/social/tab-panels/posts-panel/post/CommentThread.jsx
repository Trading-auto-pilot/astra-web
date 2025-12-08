import { useState } from 'react';
import { Box, Collapse } from '@mui/material';
import ReplyThread from './ReplyThread';
import ContentBlock from './common/content-block/ContentBlock';
import ThreadConnector from './common/thread-connector/ThreadConnector';
import ThreadInput from './common/thread-input/ThreadInput';
import ThreadToggle from './common/thread-toggle/ThreadToggle';

const CommentThread = ({ comments }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);

  return (
    <>
      {comments.length > 0 && (
        <Box sx={{ pl: 5, position: 'relative' }}>
          {open && <ThreadConnector offsetLeft={16} />}
          <ThreadConnector offsetLeft={16} elbow sx={{ top: -12 }} />
          <ThreadToggle handleToggle={toggle}>
            {open ? 'Hide all comments' : 'View all comments'}
          </ThreadToggle>
        </Box>
      )}

      <Collapse in={open} mountOnEnter unmountOnExit>
        <Box sx={{ position: 'relative' }}>
          {comments.map((comment, i) => {
            const isLast = i === comments.length - 1;

            return <CommentItem key={comment.id} comment={comment} isLast={isLast} />;
          })}
        </Box>
      </Collapse>
    </>
  );
};

const CommentItem = ({ comment, isLast }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const toggleReply = () => setShowReplyInput((prev) => !prev);

  return (
    <div>
      <Box sx={{ position: 'relative', pl: 6 }}>
        {!isLast && <ThreadConnector offsetLeft={16} />}
        <ThreadConnector offsetLeft={16} elbow sx={{ top: 0 }} />
        {(comment.replies.length > 0 || showReplyInput) && (
          <ThreadConnector offsetLeft={64} sx={{ height: 'calc(100% - 56px)', bottom: 0 }} />
        )}

        <ContentBlock content={comment} toggleThreadInput={toggleReply} />
      </Box>

      <Collapse in={showReplyInput} mountOnEnter unmountOnExit>
        <Box sx={{ position: 'relative', pl: 11 }}>
          {!isLast && <ThreadConnector offsetLeft={16} />}
          {comment.replies.length > 0 && <ThreadConnector offsetLeft={64} />}
          {showReplyInput && <ThreadConnector offsetLeft={64} elbow />}
          <ThreadInput placeholder="Reply to this comment..." toggleThreadInput={toggleReply} />
        </Box>
      </Collapse>

      <ReplyThread
        replies={comment.replies}
        isLastComment={isLast}
        toggleThreadInput={toggleReply}
      />
    </div>
  );
};

export default CommentThread;
