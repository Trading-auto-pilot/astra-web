import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Box, Paper, Stack } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useChatContext } from 'providers/ChatProvider';
import { SET_CURRENT_CONVERSATION } from 'reducers/ChatReducer';
import paths from 'routes/paths';
import ConversationAside from 'components/sections/chat/conversation/aside/ConversationAside';
import ContentHeader from 'components/sections/chat/conversation/main/ContentHeader';
import ContentFooter from 'components/sections/chat/conversation/main/content-footer/ContentFooter';
import Content from 'components/sections/chat/conversation/main/content/Content';

const drawerWidth = 404;

const Conversation = () => {
  const { chatDispatch, currentConversation, conversations, handleChatSidebar } = useChatContext();
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { up } = useBreakpoints();

  const upXl = up('xl');

  const [isDrawerOpen, setIsDrawerOpen] = useState(upXl);

  useEffect(() => {
    setIsDrawerOpen(upXl);
  }, [upXl]);

  useEffect(() => {
    if (currentConversation) {
      handleChatSidebar(false);
    }
  }, [currentConversation]);

  useEffect(() => {
    if (!conversationId) return;

    const isValid = conversations.some(({ id }) => id === conversationId);
    if (!isValid) {
      navigate(paths.chat);

      return;
    }

    if (currentConversation?.id !== conversationId) {
      chatDispatch({ type: SET_CURRENT_CONVERSATION, payload: { conversationId } });
    }
  }, [conversationId]);

  return (
    <Paper component={Stack} sx={{ height: 1, flex: 1, position: 'relative', overflow: 'hidden' }}>
      <Stack
        sx={(theme) => ({
          height: 1,
          flexGrow: 1,
          flexDirection: 'column',
          transition: theme.transitions.create('margin', {
            easing: isDrawerOpen
              ? theme.transitions.easing.easeOut
              : theme.transitions.easing.sharp,
            duration: theme.transitions.duration[isDrawerOpen ? 'enteringScreen' : 'leavingScreen'],
          }),
          marginRight: { xl: isDrawerOpen ? 0 : `-${drawerWidth}px` },
        })}
      >
        <ContentHeader handleDrawerToggle={() => setIsDrawerOpen(!isDrawerOpen)} />

        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Box sx={{ overflowY: 'auto', height: 1 }}>
            <Content />
          </Box>
        </Box>

        <ContentFooter />
      </Stack>

      <ConversationAside
        handleClose={() => setIsDrawerOpen(false)}
        isOpen={isDrawerOpen}
        drawerWidth={drawerWidth}
      />
    </Paper>
  );
};

export default Conversation;
