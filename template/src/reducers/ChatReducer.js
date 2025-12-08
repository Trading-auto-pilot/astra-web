export const SET_CHAT_SIDEBAR_STATE = 'SET_CHAT_SIDEBAR_STATE';
export const SENT_MESSAGE = 'SENT_MESSAGE';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const START_NEW_CONVERSATION = 'START_NEW_CONVERSATION';
export const SET_CURRENT_CONVERSATION = 'SET_CURRENT_CONVERSATION';
export const DELETE_CONVERSATION = 'DELETE_CONVERSATION';
export const SEARCH_CONVERSATIONS = 'SEARCH_CONVERSATIONS';
export const FILTER_CONVERSIONS = 'FILTER_CONVERSIONS';
export const UPDATE_CONVERSATION_NAME = 'UPDATE_CONVERSATION_NAME';
export const TOGGLE_STARRED_CONVERSATION = 'TOGGLE_STARRED_CONVERSATION';
export const SET_EMOJI_REACTION = 'SET_EMOJI_REACTION';
export const RESET = 'RESET';

export const chatReducer = (state, action) => {
  const updateConversations = (conversations, updatedConversation) =>
    conversations.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv));

  switch (action.type) {
    case SET_CHAT_SIDEBAR_STATE: {
      return {
        ...state,
        isChatSidebarOpen: action.payload,
      };
    }

    case SENT_MESSAGE: {
      const { message, conversationId } = action.payload;

      if (
        !message?.text?.trim() &&
        !message?.attachments?.media?.length &&
        !message?.attachments?.files?.length
      ) {
        return state;
      }

      const currentConversation = structuredClone(
        state.conversations.find((conv) => conv.id === conversationId),
      );
      if (!currentConversation) return state;

      currentConversation.messages.push({
        id: (currentConversation.messages.at(-1)?.id ?? 0) + 1,
        type: 'sent',
        createdAt: new Date(),
        readAt: null,
        text: message?.text,
        attachments: message?.attachments,
      });

      return {
        ...state,
        currentConversation,
        conversations: updateConversations(state.conversations, currentConversation),
        initialConversations: updateConversations(state.initialConversations, currentConversation),
        shouldMessagesScroll: true,
      };
    }

    case DELETE_MESSAGE: {
      const { messageId } = action.payload;

      if (!state.currentConversation) return state;
      const currentConversation = structuredClone(state.currentConversation);

      currentConversation.messages = currentConversation.messages.filter(
        (message) => message.id !== messageId,
      );

      return {
        ...state,
        currentConversation,
        conversations: updateConversations(state.conversations, currentConversation),
        initialConversations: updateConversations(state.initialConversations, currentConversation),
      };
    }

    case START_NEW_CONVERSATION: {
      const { conversationId, recipients, message } = action.payload;

      const newConversation = {
        id: conversationId,
        recipients,
        messages:
          message?.text || message?.attachments
            ? [
                {
                  id: 1,
                  type: 'sent',
                  createdAt: new Date(),
                  readAt: null,
                  text: message?.text,
                  attachments: message?.attachments,
                },
              ]
            : [],
        unreadMessages: 0,
        starred: false,
      };

      return {
        ...state,
        currentConversation: newConversation,
        conversations: [newConversation, ...state.conversations],
        initialConversations: [newConversation, ...state.initialConversations],
      };
    }

    case SET_CURRENT_CONVERSATION: {
      const { conversationId } = action.payload;

      const currentConversation = state.conversations.find((conv) => conv.id === conversationId);
      if (!currentConversation) return state;

      const updatedConversation = structuredClone(currentConversation);
      updatedConversation.messages = updatedConversation.messages.map((msg) => ({
        ...msg,
        readAt: new Date(),
      }));
      updatedConversation.unreadMessages = 0;

      return {
        ...state,
        currentConversation: updatedConversation,
        conversations: updateConversations(state.conversations, updatedConversation),
        initialConversations: updateConversations(state.initialConversations, updatedConversation),
      };
    }

    case DELETE_CONVERSATION: {
      if (!state.currentConversation) return state;

      const conversations = state.conversations.filter(
        (conv) => conv.id !== state.currentConversation?.id,
      );

      const initialConversations = state.initialConversations.filter(
        (conv) => conv.id !== state.currentConversation?.id,
      );

      return {
        ...state,
        conversations,
        initialConversations,
        currentConversation: null,
      };
    }

    case SEARCH_CONVERSATIONS: {
      const query = action.payload.toLowerCase();

      const searchedConversations = state.initialConversations.filter((conv) => {
        if (conv.conversationName?.toLowerCase().includes(query)) {
          return true;
        }

        return conv.recipients.some((p) => p.name.toLowerCase().includes(query));
      });

      return {
        ...state,
        conversations: searchedConversations,
        searchQuery: action.payload,
      };
    }

    case FILTER_CONVERSIONS: {
      const filterBy = action.payload;

      const filteredConversations = state.initialConversations.filter((conversation) =>
        filterBy === 'unread'
          ? conversation.unreadMessages
          : filterBy === 'starred'
            ? conversation.starred
            : true,
      );

      return {
        ...state,
        filterBy,
        conversations: filteredConversations,
        searchQuery: '',
      };
    }

    case SET_EMOJI_REACTION: {
      const { messageId, emoji, userId } = action.payload;

      if (!state.currentConversation) return state;
      const currentConversation = structuredClone(state.currentConversation);

      const message = currentConversation.messages.find((msg) => msg.id === messageId);
      if (!message) return state;

      const reactions = message.reactions || [];
      const existingReaction = reactions.find((r) => r.emoji === emoji && r.userId === userId);

      message.reactions = existingReaction
        ? reactions.filter((r) => !(r.emoji === emoji && r.userId === userId))
        : [...reactions.filter((r) => r.userId !== userId), { emoji, userId }];

      return {
        ...state,
        conversations: updateConversations(state.conversations, currentConversation),
        currentConversation,
        shouldMessagesScroll: false,
      };
    }

    case UPDATE_CONVERSATION_NAME: {
      const { payload } = action;

      if (!state.currentConversation) return state;
      const currentConversation = structuredClone(state.currentConversation);

      const fallbackName = currentConversation.recipients.map(({ name }) => name).join(', ');
      currentConversation.conversationName = payload?.trim() || fallbackName;

      return {
        ...state,
        conversations: updateConversations(state.conversations, currentConversation),
        initialConversations: updateConversations(state.initialConversations, currentConversation),
        currentConversation,
      };
    }

    case TOGGLE_STARRED_CONVERSATION: {
      if (!state.currentConversation) return state;
      const currentConversation = structuredClone(state.currentConversation);

      currentConversation.starred = !currentConversation.starred;

      return {
        ...state,
        conversations: updateConversations(state.conversations, currentConversation),
        initialConversations: updateConversations(state.initialConversations, currentConversation),
        currentConversation,
      };
    }

    case RESET:
      return {
        ...state,
      };
    default:
      return state;
  }
};
