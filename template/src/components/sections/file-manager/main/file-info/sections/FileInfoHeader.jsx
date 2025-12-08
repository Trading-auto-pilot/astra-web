import { Button, Paper, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const FileInfoHeader = ({ toggleDrawer }) => {
  return (
    <Stack
      component={Paper}
      background={1}
      sx={{ justifyContent: 'space-between', alignItems: 'center', px: { xs: 3, md: 5 }, py: 2 }}
    >
      <Typography variant="h6">File Info</Typography>

      <Button shape="circle" variant="text" color="neutral" onClick={toggleDrawer}>
        <IconifyIcon icon="material-symbols:close-rounded" fontSize={20} />
      </Button>
    </Stack>
  );
};

export default FileInfoHeader;
