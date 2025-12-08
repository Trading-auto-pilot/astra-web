import { Radio } from '@mui/material';
import Badge, { badgeClasses } from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const Priority = ({ priority, handleSelect }) => {
  const handleClick = (id) => {
    const options = priority.options.map((item) =>
      item.id === id ? { ...item, isSelected: true } : { ...item, isSelected: false },
    );
    handleSelect('priority', { ...priority, options });
  };

  return (
    <div>
      <Typography variant="subtitle2" sx={{ mb: 2, px: 3, fontWeight: 600 }}>
        {priority.title}
      </Typography>

      <List component="div" dense disablePadding>
        {priority.options.map((item) => (
          <ListItem
            key={item.id}
            component={Stack}
            spacing={2}
            disablePadding
            dense
            onClick={() => handleClick(item.id)}
            sx={{
              ml: -1,
              mb: 0.5,
              px: 3,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'background.elevation1',
              },
            }}
          >
            <ListItemIcon sx={{ p: 0 }}>
              <Radio
                checked={item.isSelected}
                onChange={() => handleClick(item.id)}
                name="radio-button"
              />
            </ListItemIcon>
            <Badge
              color={item.color}
              variant="dot"
              sx={{
                [`& .${badgeClasses.badge}`]: {
                  left: -12,
                  top: '50%',
                  right: 'unset',
                  transform: 'translateY(-50%)',
                },
              }}
            >
              <ListItemText primary={item.label} />
            </Badge>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Priority;
