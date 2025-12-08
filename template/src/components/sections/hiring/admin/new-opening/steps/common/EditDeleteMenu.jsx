import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const EditDeleteMenu = ({ onEdit, onDelete, ...rest }) => {
  return (
    <Menu {...rest}>
      <MenuItem onClick={onEdit}>Edit</MenuItem>
      <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
        Delete
      </MenuItem>
    </Menu>
  );
};

export default EditDeleteMenu;
