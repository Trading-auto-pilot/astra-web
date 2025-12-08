import { createContext, use, useReducer } from 'react';
import { users } from 'data/users';
import { SET_CHAT_SIDEBAR_STATE, chatReducer } from 'reducers/ChatReducer';

export const ChatContext = createContext({});

const ChatProvider = ({ conversations, children }) => {
  const initState = {
    initialConversations: conversations,
    conversations: conversations,
    currentConversation: null,
    currentUser: users[14],
    filterBy: 'all',
    searchQuery: '',
    shouldMessagesScroll: true,
    isChatSidebarOpen: false,
  };

  const [chatState, chatDispatch] = useReducer(chatReducer, initState);

  const handleChatSidebar = (value) => {
    chatDispatch({
      type: SET_CHAT_SIDEBAR_STATE,
      payload: value ?? !chatState.isChatSidebarOpen,
    });
  };

  const chatContextValue = {
    ...chatState,
    chatDispatch,
    handleChatSidebar,
  };

  return <ChatContext value={chatContextValue}>{children}</ChatContext>;
};

export const useChatContext = () => use(ChatContext);

export default ChatProvider;
