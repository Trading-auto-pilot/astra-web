import { Outlet } from 'react-router';
import { Stack } from '@mui/material';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import EmailProvider from 'providers/EmailProvider';

const EmailLayout = () => {
  const { topbarHeight } = useNavContext();
  const { up } = useBreakpoints();
  const upSm = up('sm');

  return (
    <EmailProvider>
      <Stack
        sx={({ mixins }) => ({
          height: mixins.contentHeight(
            topbarHeight,
            (upSm ? mixins.footer.sm : mixins.footer.xs) + 1,
          ),
        })}
      >
        <Outlet />
      </Stack>
    </EmailProvider>
  );
};

export default EmailLayout;
