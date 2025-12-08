import { useState } from 'react';
import { LiveEditor, LiveError, LivePreview } from 'react-live';
import { Box, Card, CardActions, CardContent, Collapse } from '@mui/material';
import Button from '@mui/material/Button';
import { convertSpacesToTabs } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import LiveProvider from 'components/common/LiveProvider';

const DocCard = ({ sx, hidePreview, children, code, ...rest }) => {
  const [showCode, setShowCode] = useState(false);
  const [isCodeCopied, setIsCodeCopied] = useState(false);

  const handleCopyCode = async () => {
    if (code) {
      setIsCodeCopied(true);
      await navigator.clipboard.writeText(code);
      setTimeout(() => setIsCodeCopied(false), 2000);
    }
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 5, borderColor: 'dividerLight', ...sx }}>
      <LiveProvider code={convertSpacesToTabs(code || '')} {...rest}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          {children}
          {code && (
            <>
              <LivePreview />
              {!hidePreview && <LiveError />}
            </>
          )}
        </CardContent>
        <CardActions
          sx={[
            {
              bgcolor: 'background.elevation1',
              p: { xs: 3, md: 5 },
            },
            showCode && {
              pb: 3,
            },
          ]}
        >
          <Button
            variant="soft"
            color="neutral"
            sx={{
              minWidth: 132,
            }}
            startIcon={
              <IconifyIcon
                icon={
                  showCode ? 'material-symbols:code-off-rounded' : 'material-symbols:code-rounded'
                }
                fontSize={16}
              />
            }
            onClick={() => setShowCode(!showCode)}
          >
            {showCode ? 'Hide' : 'Show'} Code
          </Button>
          <Button
            variant="text"
            color="neutral"
            startIcon={
              <IconifyIcon
                icon={
                  isCodeCopied
                    ? 'material-symbols:library-add-check-outline-rounded'
                    : 'material-symbols:content-copy-outline-rounded'
                }
                fontSize={16}
              />
            }
            onClick={handleCopyCode}
          >
            {isCodeCopied ? 'Code Copied' : 'Copy Code'}
          </Button>
        </CardActions>
        <Collapse in={showCode} timeout="auto" unmountOnExit>
          <CardContent
            sx={{
              bgcolor: 'background.elevation1',
              p: { xs: 3, md: 5 },
              pt: { xs: 0, md: 0 },
              paddingBottom: '40px !important',
            }}
          >
            <Box
              sx={{
                bgcolor: 'background.elevation2',
                p: 3,
                borderRadius: 2,
                maxHeight: 'min(68vh, 1000px)',
                overflow: 'auto',
              }}
            >
              <LiveEditor />
            </Box>
          </CardContent>
        </Collapse>
      </LiveProvider>
    </Card>
  );
};

export default DocCard;
