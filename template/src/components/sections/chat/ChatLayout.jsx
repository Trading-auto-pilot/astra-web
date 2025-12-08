import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { Paper, Stack } from '@mui/material';
import { conversations } from 'data/chat';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import ChatProvider from 'providers/ChatProvider';
import PageLoader from 'components/loading/PageLoader';
import ChatSidebar from 'components/sections/chat/sidebar/ChatSidebar';

const ChatLayout = () => {
  const { topbarHeight } = useNavContext();
  const { up } = useBreakpoints();
  const upSm = up('sm');

  return (
    <ChatProvider conversations={conversations}>
      <Stack
        component={Paper}
        sx={({ mixins }) => ({
          height: mixins.contentHeight(
            topbarHeight,
            (upSm ? mixins.footer.sm : mixins.footer.xs) + 1,
          ),
        })}
      >
        <ChatSidebar />

        <Suspense fallback={<PageLoader sx={{ flex: 1 }} />}>
          <Outlet />
        </Suspense>
      </Stack>
    </ChatProvider>
  );
};

export default ChatLayout;
