import { useParams } from 'react-router';
import { Link, ListItem, ListItemButton, listItemButtonClasses } from '@mui/material';
import { cssVarRgba } from 'lib/utils';
import { useBulkSelect } from 'providers/BulkSelectProvider';
import { useEmailContext } from 'providers/EmailProvider';
import paths from 'routes/paths';
import EmailListItemActions from './EmailListItemActions';
import EmailListItemContent from './EmailListItemContent';
import ListItemFloatingActions from './ListItemFloatingActions';

const EmailListItem = ({ mail }) => {
  const { label, id } = useParams();
  const { resizableWidth } = useEmailContext();
  const { selectedIds } = useBulkSelect();

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={Link}
        underline="none"
        href={paths.emailDetails(label, String(mail.id))}
        sx={[
          {
            bgcolor: (theme) =>
              selectedIds.includes(mail.id)
                ? cssVarRgba(theme.vars.palette.primary.lightChannel, 0.2)
                : 'transparent',
            py: 2,
            [`&.${listItemButtonClasses.selected}`]: {
              bgcolor: (theme) =>
                selectedIds.includes(mail.id)
                  ? cssVarRgba(theme.vars.palette.primary.lightChannel, 0.2)
                  : 'primary.lighter',
            },
            '&:hover': {
              '.actions': {
                opacity: 1,
                transition: ({ transitions }) =>
                  transitions.create(['opacity', 'background-color'], {
                    duration: transitions.duration.short,
                    easing: transitions.easing.easeIn,
                  }),
              },
              [`&.${listItemButtonClasses.selected}`]: {
                '.actions': {
                  bgcolor: 'primary.lighter',
                },
              },
            },
          },
          !!id &&
            resizableWidth < 500 && {
              display: 'block',
            },
        ]}
        selected={mail.id === Number(id)}
      >
        <EmailListItemActions email={mail} />
        <EmailListItemContent email={mail} />
        <ListItemFloatingActions email={mail} />
      </ListItemButton>
    </ListItem>
  );
};

export default EmailListItem;
