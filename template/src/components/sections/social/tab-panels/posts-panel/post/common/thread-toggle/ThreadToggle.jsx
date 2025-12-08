import { Button } from '@mui/material';

const ThreadToggle = ({ handleToggle, children }) => {
  return (
    <Button
      onClick={handleToggle}
      sx={{
        alignSelf: 'flex-start',
        textWrap: 'nowrap',
        position: 'relative',
      }}
    >
      {children}
    </Button>
  );
};

export default ThreadToggle;
