import { createContext, use, useReducer, useState } from 'react';
import { emails as allEmails } from 'data/email';
import { emailReducer } from 'reducers/EmailReducer';

const initialState = {
  emails: [],
  email: null,
  initialEmails: allEmails,
};

export const emailSidebarWidth = 270;

const EmailContext = createContext({});

const EmailProvider = ({ children }) => {
  const [emailState, emailDispatch] = useReducer(emailReducer, initialState);
  const [resizableWidth, setResizableWidth] = useState(0);

  const handleResize = (width) => {
    setResizableWidth(width);
  };

  return (
    <EmailContext
      value={{
        emailState,
        emailDispatch,
        resizableWidth,
        handleResize,
      }}
    >
      {children}
    </EmailContext>
  );
};

export default EmailProvider;

export const useEmailContext = () => use(EmailContext);
