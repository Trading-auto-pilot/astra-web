import { Radio } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const DueDate = ({ dueDate, handleSelect }) => {
  const handleClick = (id) => {
    const options = dueDate.options.map((item) =>
      item.id === id ? { ...item, isSelected: true } : { ...item, isSelected: false },
    );
    handleSelect('dueDate', { ...dueDate, options });
  };

  return (
    <div>
      <Typography variant="subtitle2" sx={{ mb: 2, px: 3, fontWeight: 600 }}>
        {dueDate.title}
      </Typography>

      <List component="div" dense disablePadding>
        {dueDate.options.map((item) => (
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
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default DueDate;
