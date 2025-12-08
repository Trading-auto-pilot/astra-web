import { useRef } from 'react';
import { Box } from '@mui/material';
import HeaderBrand from './HeaderBrand';
import HeaderNav from './HeaderNav';
import { useHeaderAnimation } from './useHeaderAnimation';

const ShowcaseHeader = () => {
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const navItemsRef = useRef([]);

  useHeaderAnimation(headerRef, logoRef, navItemsRef);

  const registerNavItemRef = (el) => {
    if (el && !navItemsRef.current.includes(el)) navItemsRef.current.push(el);
  };

  return (
    <Box
      ref={headerRef}
      sx={(theme) => ({
        p: { xs: theme.spacing(2.5, 3), md: theme.spacing(2.5, 5) },
        position: 'fixed',
        top: 0,
        left: 0,
        width: 1,
        zIndex: theme.zIndex.appBar + 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      })}
    >
      <HeaderBrand logoRef={logoRef} />
      <HeaderNav registerNavItemRef={registerNavItemRef} />
    </Box>
  );
};

export default ShowcaseHeader;
