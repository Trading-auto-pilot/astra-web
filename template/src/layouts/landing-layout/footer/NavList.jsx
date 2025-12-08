import { Link, ListItemText } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';

const NavList = ({ title, items }) => {
  return (
    <List
      subheader={
        <ListSubheader
          sx={{
            flexShrink: 0,
            mb: 1,
            typography: 'overline',
            fontWeight: 700,
            color: 'text.disabled',
            bgcolor: 'transparent',
          }}
        >
          {title}
        </ListSubheader>
      }
      sx={{ pb: 0 }}
    >
      {items.map((item) => (
        <ListItem key={item.label} sx={{ py: 0.5 }}>
          <ListItemText disableTypography sx={{ typography: 'caption' }}>
            <Link href={item.href} color="textPrimary" fontWeight={500}>
              {item.label}
            </Link>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export default NavList;
