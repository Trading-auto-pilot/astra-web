import { useState } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import TogglePanel from 'components/sections/calendar/CalendarSidebar/TogglePanel';

const checkboxes = [
  { id: 1, label: 'Tasks', color: 'default' },
  { id: 2, label: 'Label', color: 'primary' },
  { id: 3, label: 'My Event', color: 'secondary' },
  { id: 4, label: 'Birthday', color: 'info' },
  { id: 5, label: 'Undefined', color: 'success' },
  { id: 6, label: 'Local Holidays', color: 'error' },
];
const CategoryList = () => {
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <TogglePanel title="Categories" defaultOpen>
      <List dense disablePadding sx={{ mb: 2 }}>
        {checkboxes.map((item) => (
          <ListItem
            key={item.id}
            onMouseEnter={() => setHoverIndex(item.id)}
            onMouseLeave={() => setHoverIndex(null)}
            sx={{ borderRadius: 2, '&:hover': { backgroundColor: 'background.menuElevation1' } }}
            secondaryAction={
              <IconButton size="small" sx={{ opacity: hoverIndex === item.id ? 1 : 0 }}>
                <IconifyIcon icon="material-symbols:more-vert" fontSize={14} />
              </IconButton>
            }
          >
            <FormControlLabel
              control={<Checkbox color={item.color} defaultChecked />}
              label={<Typography variant="subtitle2">{item.label}</Typography>}
            />
          </ListItem>
        ))}
      </List>

      <Button
        size="small"
        color="neutral"
        startIcon={<IconifyIcon icon="material-symbols:add" fontSize={18} />}
        sx={{ ml: 1 }}
      >
        New Event List
      </Button>
    </TogglePanel>
  );
};

export default CategoryList;
