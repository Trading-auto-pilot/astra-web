import { useState } from 'react';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';

const CopyableText = ({ text, link = false, href = '#!', sx }) => {
  const [isTextCopied, setIsTextCopied] = useState(false);

  const handleCopyText = async (text) => {
    setIsTextCopied(true);
    await navigator.clipboard.writeText(text);
    setTimeout(() => setIsTextCopied(false), 2000);
  };

  return (
    <Stack gap={0.5} sx={{ alignItems: 'center', ...sx }}>
      <Typography
        component={link ? Link : 'p'}
        href={link ? href : undefined}
        variant="body2"
        underline="none"
        sx={{ lineClamp: 1, wordBreak: 'break-all', color: 'text.primary' }}
      >
        {text}
      </Typography>

      <Tooltip title={isTextCopied ? 'Copied!' : 'Copy'}>
        <Button
          variant="text"
          size="small"
          shape="square"
          sx={{ my: -0.5 }}
          onClick={() => handleCopyText(text)}
        >
          <IconifyIcon icon="material-symbols:content-copy-outline" sx={{ fontSize: 16 }} />
        </Button>
      </Tooltip>
    </Stack>
  );
};

export default CopyableText;
