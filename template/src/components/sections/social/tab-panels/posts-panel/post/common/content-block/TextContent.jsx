import { useState } from 'react';
import { Link, Typography } from '@mui/material';

const TextContent = ({ content }) => {
  const [showMore, setShowMore] = useState(content.length < 250);

  return (
    <Typography variant="body2" sx={{ textWrap: 'pretty', color: 'text.secondary' }}>
      {content.slice(0, showMore ? content.length : 250)}
      {!showMore && '... '}
      {!showMore && (
        <Link onClick={() => setShowMore(true)} href="#!" sx={{ fontWeight: 700 }}>
          Show more
        </Link>
      )}
    </Typography>
  );
};

export default TextContent;
