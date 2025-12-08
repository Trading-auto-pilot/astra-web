import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Stack, Typography } from '@mui/material';
import illustrationDark from 'assets/images/illustrations/7-dark.webp';
import illustration from 'assets/images/illustrations/7.webp';
import dayjs from 'dayjs';
import { useEmailContext } from 'providers/EmailProvider';
import { GET_EMAILS } from 'reducers/EmailReducer';
import Image from 'components/base/Image';
import SimpleBar from 'components/base/SimpleBar';
import PageLoader from 'components/loading/PageLoader';
import EmailHeader from './EmailHeader';
import EmailList from './EmailList';
import EmailListHeader from './email-list-header/EmailListHeader';

const EmailListContainer = ({ toggleDrawer }) => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    emailState: { emails, initialEmails },
    emailDispatch,
  } = useEmailContext();
  const params = useParams();

  const emailData = useMemo(() => {
    return emails.reduce(
      (acc, val) => {
        const diffInDays = dayjs().diff(dayjs(val.time), 'days');
        if (diffInDays === 0) {
          acc.today.push(val);
        } else if (diffInDays === 1) {
          acc.yesterday.push(val);
        } else {
          acc.older.push(val);
        }

        return acc;
      },
      {
        today: [],
        yesterday: [],
        older: [],
      },
    );
  }, [emails]);

  useEffect(() => {
    if (initialEmails || emails.length) {
      setIsLoading(false);
    }
  }, [emails, initialEmails]);

  useEffect(() => {
    if (params.label) {
      emailDispatch({ type: GET_EMAILS, payload: params.label });
    }
  }, [params.label, initialEmails]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <SimpleBar
      sx={{
        py: 5,
        '& .simplebar-content': {
          height: emails.length ? 'auto' : 1,
        },
      }}
    >
      <Stack direction="column" sx={{ height: 1 }}>
        <EmailHeader toggleDrawer={toggleDrawer} />
        <EmailListHeader />
        <Stack direction="column" gap={3} sx={{ flex: 1 }}>
          {Object.keys(emailData).map(
            (key) =>
              emailData[key].length > 0 && (
                <EmailList
                  key={key}
                  title={key.charAt(0).toUpperCase() + key.slice(1)}
                  emails={emailData[key]}
                />
              ),
          )}
          {!emails.length && (
            <Stack
              direction="column"
              sx={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
            >
              <Image src={{ light: illustration, dark: illustrationDark }} width={100} />
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mt: 2 }}>
                No conversations in {params.label}.
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </SimpleBar>
  );
};

export default EmailListContainer;
