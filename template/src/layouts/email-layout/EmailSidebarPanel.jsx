import { useMemo } from 'react';
import { useParams } from 'react-router';
import {
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  listItemTextClasses,
} from '@mui/material';
import { emailCategory } from 'data/email';
import { useEmailContext } from 'providers/EmailProvider';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';

const EmailSidebarPanel = ({ toggleDrawer }) => {
  const {
    emailState: { initialEmails },
  } = useEmailContext();
  const { label } = useParams();

  const unreadMailCount = useMemo(
    () => initialEmails.filter((email) => email.folder === 'inbox' && email.readAt === null),
    [initialEmails],
  ).length;
  const draftMailCount = useMemo(
    () => initialEmails.filter((email) => email.folder === 'draft'),
    [initialEmails],
  ).length;

  return (
    <List sx={{ p: 0 }}>
      {emailCategory.map((item) => (
        <ListItemButton
          key={item.title}
          component={Link}
          underline="none"
          href={paths.emailLabel(item.title.toLowerCase())}
          onClick={toggleDrawer}
          sx={{ py: 0.5, mb: '2px' }}
        >
          <ListItemIcon>
            <IconifyIcon
              icon={item.icon}
              sx={[
                {
                  fontSize: 14,
                  color: 'text.primary',
                },
                label === item.title.toLowerCase() && {
                  color: 'primary.dark',
                },
              ]}
            />
          </ListItemIcon>
          <ListItemText
            primary={item.title}
            sx={{
              [`& .${listItemTextClasses.primary}`]: {
                typography: 'caption',
                fontWeight: 'medium',
                whiteSpace: 'nowrap',
                color: label === item.title.toLowerCase() ? 'primary.dark' : 'text.primary',
              },
            }}
          />
          {item.title === 'Inbox' && unreadMailCount > 0 && (
            <Typography color="warning.dark" sx={{ fontSize: '10px', fontWeight: 700 }}>
              {unreadMailCount}
            </Typography>
          )}
          {item.title === 'Draft' && draftMailCount > 0 && (
            <Typography color="info.dark" sx={{ fontSize: '10px', fontWeight: 500 }}>
              {draftMailCount}
            </Typography>
          )}
        </ListItemButton>
      ))}
    </List>
  );
};

export default EmailSidebarPanel;
