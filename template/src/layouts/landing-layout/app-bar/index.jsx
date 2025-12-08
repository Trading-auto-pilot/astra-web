import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ThemeToggler from 'layouts/main-layout/common/ThemeToggler';
import SearchBox, { SearchBoxButton } from 'layouts/main-layout/common/search-box/SearchBox';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import paths from 'routes/paths';
import Logo from 'components/common/Logo';
import Sidenav from './nav/Sidenav';
import Topnav from './nav/Topnav';

const menus = [
  {
    label: 'Home',
    href: paths.landingHomepage,
  },
  {
    label: 'About Us',
    href: paths.landingAbout,
  },
  {
    label: 'Contact',
    href: paths.landingContact,
  },
  {
    label: 'Pages',
    submenus: [
      {
        label: 'Homepage',
        href: paths.landingHomepage,
        icon: 'material-symbols:home-outline-rounded',
        secondaryText: 'Explore our main landing page and key highlights',
      },
      {
        label: 'About Us',
        href: paths.landingAbout,
        icon: 'material-symbols:info-outline-rounded',
        secondaryText: 'Learn more about our mission, vision, and team',
      },
      {
        label: 'Contact',
        href: paths.landingContact,
        icon: 'material-symbols:phone-in-talk-outline-rounded',
        secondaryText: 'Reach out to us for inquiries and support',
      },
      {
        label: 'FAQs',
        href: paths.landingFaq,
        icon: 'material-symbols:format-list-bulleted-rounded',
        secondaryText: 'Find answers to the most common questions',
      },
      {
        label: 'Pricing',
        href: '#!',
        icon: 'material-symbols:attach-money-rounded',
        secondaryText: 'Discover our plans and choose what fits you best',
      },
      {
        label: '404',
        href: paths.landing404,
        icon: 'material-symbols:warning-outline-rounded',
        secondaryText: 'The page you’re looking for could not be found',
      },
      {
        label: 'Maintenance',
        href: paths.landingMaintenance,
        icon: 'material-symbols:service-toolbox-outline-rounded',
        secondaryText: 'We’re performing updates to serve you better',
      },
      {
        label: 'Coming Soon',
        href: paths.landingComingSoon,
        icon: 'material-symbols:timer-outline-rounded',
        secondaryText: 'Stay tuned for exciting features on the way',
      },
    ],
  },
];

gsap.registerPlugin(ScrollTrigger);

const LandingAppBar = (props) => {
  const appBarRef = useRef(null);
  const popoverAnchorRef = useRef(null);
  const { up } = useBreakpoints();

  const upSm = up('sm');
  const upMd = up('md');
  const upLg = up('lg');

  useGSAP(() => {
    if (!appBarRef.current) return;

    gsap.fromTo(
      appBarRef.current,
      {
        '--bg-opacity': 0,
      },
      {
        '--bg-opacity': 1,
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: '200px top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  }, []);

  return (
    <AppBar
      ref={appBarRef}
      sx={{
        outline: 0,
        bgcolor: 'transparent',
        transition: 'none',
        '--bg-opacity': 0,
        background: ({ vars }) =>
          `rgba(${vars.palette.background.paperChannel} / var(--bg-opacity))`,
      }}
      {...props}
    >
      <Toolbar
        sx={{
          px: { xs: 3, md: 5 },
          maxWidth: 1448,
          mx: 'auto',
          minHeight: 56,
          width: 1,
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Stack gap={{ xs: 1, sm: 2 }} sx={{ flex: 1, alignItems: 'center' }}>
          <Logo showName={upMd} />
          {upSm ? (
            <SearchBox
              sx={{
                width: 1,
                maxWidth: 364,
              }}
            />
          ) : (
            <SearchBoxButton />
          )}
        </Stack>
        <Stack gap={1} ref={popoverAnchorRef}>
          {upLg && <Topnav menus={menus} anchorRef={popoverAnchorRef} />}
          <ThemeToggler />
          <Button variant="contained" href="#!" sx={{ minWidth: 120 }}>
            Log In
          </Button>
          {!upLg && <Sidenav menus={menus} />}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default LandingAppBar;
