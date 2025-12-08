import { useEffect, useState } from 'react';
import { Button, Stack, Toolbar } from '@mui/material';
import { kebabCase } from 'lib/utils';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import paths from 'routes/paths';
import CollapsedMenu from './CollapsedMenu';

const SecondaryAppbarLinks = [
  { label: 'Today’s deals', url: '#!' },
  { label: 'Orders', url: paths.orderList },
  { label: 'Track order', url: paths.orderTrack },
  { label: 'Recently viewed', url: '#!' },
  { label: 'Recommendations', url: '#!' },
  { label: 'Wishlist', url: paths.wishlist },
  { label: 'Membership', url: '#!' },
  { label: 'Deals', url: '#!' },
  { label: 'Sales', url: '#!' },
];

const breakpointsVisibleLinks = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 9,
  xl: SecondaryAppbarLinks.length,
};

const SecondaryAppbar = () => {
  const { currentBreakpoint } = useBreakpoints();

  const [visibleLinks, setVisibleLinks] = useState([]);
  const [collapsedLinks, setCollapsedLinks] = useState([]);

  useEffect(() => {
    const numVisibleLinks = breakpointsVisibleLinks[currentBreakpoint] || 2;
    setVisibleLinks(SecondaryAppbarLinks.slice(0, numVisibleLinks));
    setCollapsedLinks(SecondaryAppbarLinks.slice(numVisibleLinks));
  }, [currentBreakpoint]);

  return (
    <Toolbar
      component="nav"
      sx={{
        px: { xs: 3, md: 5 },
        minHeight: { xs: 38 },
        bgcolor: 'background.elevation1',
      }}
    >
      <Stack sx={{ width: 1 }}>
        {visibleLinks.map(({ label, url }, index) => (
          <Button
            key={kebabCase(label)}
            color="neutral"
            variant="text"
            size="small"
            href={url}
            sx={{
              whiteSpace: 'nowrap',
              px: 1.5,
              ...(index === 1 && { ml: 'auto' }),
            }}
          >
            {label}
          </Button>
        ))}
      </Stack>
      {collapsedLinks.length > 0 && <CollapsedMenu links={collapsedLinks} />}
    </Toolbar>
  );
};

export default SecondaryAppbar;
