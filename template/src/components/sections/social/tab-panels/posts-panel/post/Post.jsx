import { useState } from 'react';
import { Box, Collapse } from '@mui/material';
import CommentThread from './CommentThread';
import ContentBlock from './common/content-block/ContentBlock';
import ThreadConnector from './common/thread-connector/ThreadConnector';
import ThreadInput from './common/thread-input/ThreadInput';

const Post = ({ post }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const toggleInput = () => setShowCommentInput((prev) => !prev);

  return (
    <div>
      <Box sx={{ position: 'relative' }}>
        {(post.comments.length > 0 || showCommentInput) && (
          <ThreadConnector offsetLeft={16} sx={{ height: 'calc(100% - 56px)', bottom: 0 }} />
        )}
        <ContentBlock content={post} toggleThreadInput={toggleInput} />
      </Box>

      <Collapse in={showCommentInput} mountOnEnter unmountOnExit>
        <Box sx={{ position: 'relative', pl: 6 }}>
          {post.comments.length > 0 && <ThreadConnector offsetLeft={16} />}
          {showCommentInput && <ThreadConnector offsetLeft={16} elbow />}
          <ThreadInput toggleThreadInput={toggleInput} />
        </Box>
      </Collapse>

      <CommentThread comments={post.comments} />
    </div>
  );
};

export default Post;
