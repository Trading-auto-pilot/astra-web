import { Paper } from '@mui/material';

const MiniSidebar = ({ children }) => {
  return <Paper sx={{ width: 96, flexShrink: 0, zIndex: 11 }}>{children}</Paper>;
};

export default MiniSidebar;
