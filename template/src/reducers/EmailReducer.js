import dayjs from 'dayjs';

export const DELETE_EMAIL = 'DELETE_EMAIL';
export const ARCHIVE_EMAIL = 'ARCHIVE_EMAIL';
export const SNOOZE_EMAIL = 'SNOOZE_EMAIL';
export const STARRED_EMAIL = 'STARRED_EMAIL';
export const IMPORTANT_EMAIL = 'IMPORTANT_EMAIL';
export const UPDATE_MESSAGE_STATUS = 'UPDATE_MESSAGE_STATUS';
export const SEARCH_EMAIL = 'SEARCH_EMAIL';
export const REFRESH_EMAILS = 'REFRESH_EMAILS';
export const GET_EMAILS = 'GET_EMAILS';
export const GET_EMAIL = 'GET_EMAIL';

const updateFolder = (emails, ids, folder) => {
  return emails.map((email) =>
    ids.includes(email.id)
      ? {
          ...email,
          folder: folder,
        }
      : email,
  );
};

const toggleEmailProperty = (emails, ids, property, isAllToggled) => {
  return emails.map((email) => {
    if (ids.includes(email.id)) {
      return {
        ...email,
        [property]: isAllToggled ? isAllToggled : !email[property],
      };
    }

    return email;
  });
};

export const emailReducer = (state, action) => {
  const getFilteredEmails = (folder) => {
    return state.initialEmails.filter((email) => {
      switch (folder) {
        case 'starred':
          return email.starred && email.folder !== 'trash';
        case 'important':
          return email.important && email.folder !== 'trash';
        case 'inbox':
          return email.folder === 'inbox' && email.snoozedTill === null;
        case 'snoozed':
          return (
            email.snoozedTill !== null && email.folder !== 'trash' && email.folder !== 'archived'
          );
        default:
          return email.folder === folder;
      }
    });
  };
  switch (action.type) {
    case GET_EMAILS: {
      return {
        ...state,
        emails: getFilteredEmails(action.payload),
      };
    }
    case GET_EMAIL: {
      const email = state.emails.find((email) => email.id === action.payload);

      return {
        ...state,
        email: email,
      };
    }
    case DELETE_EMAIL: {
      return {
        ...state,
        emails: updateFolder(state.emails, action.payload, 'trash'),
        initialEmails: updateFolder(state.initialEmails, action.payload, 'trash'),
      };
    }
    case ARCHIVE_EMAIL: {
      return {
        ...state,
        emails: updateFolder(state.emails, action.payload, 'archived'),
        initialEmails: updateFolder(state.initialEmails, action.payload, 'archived'),
      };
    }
    case SNOOZE_EMAIL: {
      const { ids, snoozed } = action.payload;
      const updatedEmails = (emails) => {
        return emails.map((email) => {
          if (ids.includes(email.id)) {
            return {
              ...email,
              snoozedTill: snoozed
                ? dayjs().add(1, 'd').toDate()
                : email.snoozedTill === null
                  ? dayjs().add(1, 'd').toDate()
                  : null,
            };
          }

          return email;
        });
      };

      return {
        ...state,
        emails: updatedEmails(state.emails),
        initialEmails: updatedEmails(state.initialEmails),
      };
    }
    case STARRED_EMAIL: {
      const { starred, ids } = action.payload;

      return {
        ...state,
        emails: toggleEmailProperty(state.emails, ids, 'starred', starred),
        initialEmails: toggleEmailProperty(state.initialEmails, ids, 'starred', starred),
      };
    }
    case IMPORTANT_EMAIL: {
      const { ids, important } = action.payload;

      return {
        ...state,
        emails: toggleEmailProperty(state.emails, ids, 'important', important),
        initialEmails: toggleEmailProperty(state.initialEmails, ids, 'important', important),
      };
    }
    case UPDATE_MESSAGE_STATUS: {
      const { actionType, ids } = action.payload;

      const updatedEmails = (emails) =>
        emails.map((email) =>
          ids.includes(email.id)
            ? {
                ...email,
                readAt: actionType
                  ? actionType === 'mark_as_read'
                    ? dayjs().toISOString()
                    : null
                  : email.readAt === null
                    ? dayjs().toISOString()
                    : null,
              }
            : email,
        );

      return {
        ...state,
        emails: updatedEmails(state.emails),
        initialEmails: updatedEmails(state.initialEmails),
      };
    }
    case SEARCH_EMAIL: {
      const { query, folder } = action.payload;
      const queryText = query.toLowerCase();
      const currentFilteredEmails = getFilteredEmails(folder);
      const searchedEmails = currentFilteredEmails.filter(
        (email) =>
          email.user.email.toLowerCase().includes(queryText) ||
          email.user.name.toLowerCase().includes(queryText) ||
          email.subject.toLowerCase().includes(queryText),
      );

      return {
        ...state,
        emails: searchedEmails,
      };
    }
    case REFRESH_EMAILS:
      return {
        ...state,
        emails: getFilteredEmails(action.payload),
      };
    default:
      return state;
  }
};
