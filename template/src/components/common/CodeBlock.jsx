import { LiveEditor } from 'react-live';
import { Box } from '@mui/material';
import SimpleBar from 'components/base/SimpleBar';
import LiveProvider from './LiveProvider';

const CodeBlock = ({ sx, ...rest }) => {
  return (
    <LiveProvider disabled {...rest}>
      <Box
        sx={{
          bgcolor: (theme) => theme.vars.palette.background.elevation2,
          px: 2,
          pt: 1,
          borderRadius: 2,
          fontSize: 14,
          my: 2,
          ...sx,
        }}
      >
        <SimpleBar sx={{ pb: 1 }}>
          <LiveEditor />
        </SimpleBar>
      </Box>
    </LiveProvider>
  );
};

export default CodeBlock;
