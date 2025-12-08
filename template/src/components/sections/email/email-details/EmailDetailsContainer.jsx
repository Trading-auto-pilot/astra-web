import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { Stack, Typography } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useEmailContext } from 'providers/EmailProvider';
import { GET_EMAIL, UPDATE_MESSAGE_STATUS } from 'reducers/EmailReducer';
import paths from 'routes/paths';
import SimpleBar from 'components/base/SimpleBar';
import PageLoader from 'components/loading/PageLoader';
import EmailDetailsContent from './EmailDetailsContent';
import EmailDetailsHeader from './EmailDetailsHeader';
import EmailReply from './EmailReply';

const EmailDetailsContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    emailState: { email, initialEmails },
    emailDispatch,
  } = useEmailContext();
  const params = useParams();
  const { down } = useBreakpoints();
  const downLg = down('lg');

  useEffect(() => {
    if (email) {
      setIsLoading(false);
    }
  }, [email]);

  useEffect(() => {
    emailDispatch({ type: GET_EMAIL, payload: Number(params.id) });
  }, [params.id, initialEmails]);

  useEffect(() => {
    emailDispatch({
      type: UPDATE_MESSAGE_STATUS,
      payload: { ids: [Number(params.id)], actionType: 'mark_as_read' },
    });
  }, [params.id]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!email && downLg) {
    return <Navigate to={paths.emailLabel(params.label)} />;
  }

  return (
    <SimpleBar
      sx={{ px: { xs: 3, md: 5 }, py: 5, '.simplebar-content': { height: email ? 'auto' : 1 } }}
    >
      {params.id && email ? (
        <>
          <EmailDetailsHeader />
          <EmailDetailsContent />
          <EmailReply />
        </>
      ) : (
        <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mt: 5 }}>
            No conversations selected
          </Typography>
        </Stack>
      )}
    </SimpleBar>
  );
};

export default EmailDetailsContainer;
