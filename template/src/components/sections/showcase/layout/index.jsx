import { Box } from '@mui/material';
import ShowcaseFooter from './footer';
import ShowcaseHeader from './header';
import HeaderBlur from './header/HeaderBlur';

const ShowcaseLayout = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        overscrollBehavior: 'none',
        bgcolor: (theme) => theme.palette.grey[950],
      }}
    >
      <HeaderBlur />
      <ShowcaseHeader />

      {children}

      <ShowcaseFooter />
    </Box>
  );
};

export default ShowcaseLayout;
