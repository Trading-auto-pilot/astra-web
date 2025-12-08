import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const Assignee = ({ assignee, handleSelect }) => {
  const handleClick = (id) => {
    const options = assignee.options.map((item) =>
      item.id === id ? { ...item, isSelected: !item.isSelected } : item,
    );
    handleSelect('assignee', { ...assignee, options });
  };

  return (
    <div>
      <Typography variant="subtitle2" sx={{ mb: 2, px: 3, fontWeight: 600 }}>
        {assignee.title}
      </Typography>

      <List component="div" dense disablePadding>
        {assignee.options.map((item) => (
          <ListItem
            key={item.id}
            component={Stack}
            spacing={1}
            disablePadding
            dense
            onClick={() => handleClick(item.id)}
            sx={{
              ml: -1,
              mb: 0.5,
              px: 3,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'background.elevation1',
              },
            }}
          >
            <ListItemIcon sx={{ p: 0 }}>
              <Checkbox checked={item.isSelected} onChange={() => handleClick(item.id)} />
            </ListItemIcon>
            <ListItemAvatar sx={{ minWidth: 'unset' }}>
              <Avatar src={item.avatar} alt={item.avatar} sx={{ height: 24, width: 24 }} />
            </ListItemAvatar>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Assignee;
