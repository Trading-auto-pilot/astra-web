import { Button, Stack, buttonClasses } from '@mui/material';
import { HashLinkBehavior } from 'theme/components/Link';
import IconifyIcon from './IconifyIcon';

const AnchorLinkContainer = ({ children, hashHref, sx, anchorSize = 'medium' }) => {
  return (
    <Stack
      sx={{
        gap: 1,
        alignItems: 'center',

        '&:hover': {
          [`& .${buttonClasses.root}`]: {
            visibility: 'visible',
          },
        },

        ...sx,
      }}
    >
      {children}
      <Button
        variant="soft"
        color="primary"
        size={anchorSize}
        shape="square"
        LinkComponent={HashLinkBehavior}
        href={`#${hashHref}`}
        sx={{ visibility: 'hidden' }}
      >
        <IconifyIcon icon="material-symbols:link-rounded" fontSize={20} />
      </Button>
    </Stack>
  );
};

export default AnchorLinkContainer;
