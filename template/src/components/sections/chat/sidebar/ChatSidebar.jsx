import { Box, Paper, Stack } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useChatContext } from 'providers/ChatProvider';
import SimpleBar from 'components/base/SimpleBar';
import ConversationList from './conversation-list/ConversationList';
import MiniSidebar from './layouts/MiniSidebar';
import ResizableSidebar from './layouts/ResizableSidebar';
import ResponsiveSidebar from './layouts/ResponsiveSidebar';
import SidebarFallback from './layouts/SidebarFallback';
import SidebarHeader from './layouts/SidebarHeader';

const ChatSidebar = () => {
  const { conversations } = useChatContext();

  const { only } = useBreakpoints();
  const onlyXs = only('xs');
  const onlySm = only('sm');

  const chatSidebarContent = (
    <Stack component={Paper} direction="column" sx={{ height: 1, flexShrink: 0, width: 1 }}>
      <SidebarHeader />

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {conversations.length > 0 ? (
          <SimpleBar disableHorizontal sx={{ px: { xs: 3, sm: 2, md: 3 }, height: 1 }}>
            <ConversationList />
          </SimpleBar>
        ) : (
          <SidebarFallback />
        )}
      </Box>
    </Stack>
  );

  return onlyXs ? (
    <ResponsiveSidebar>{chatSidebarContent}</ResponsiveSidebar>
  ) : onlySm ? (
    <MiniSidebar>{chatSidebarContent}</MiniSidebar>
  ) : (
    <ResizableSidebar>{chatSidebarContent}</ResizableSidebar>
  );
};

export default ChatSidebar;
