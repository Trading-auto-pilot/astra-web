import { Button, Stack } from '@mui/material';
import { navItems } from 'data/showcase';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import NeutralButton from '../../common/NeutralButton';

const HeaderNav = ({ registerNavItemRef }) => {
  const { up } = useBreakpoints();
  const upMd = up('md');

  return (
    <Stack sx={{ gap: 2, alignItems: 'center' }}>
      {upMd &&
        navItems.map(({ label, href }) => (
          <Button
            key={label}
            ref={registerNavItemRef}
            size="medium"
            variant="text"
            color="neutral"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ p: 1.5, color: 'common.white' }}
          >
            {label}
          </Button>
        ))}

      <NeutralButton
        ref={registerNavItemRef}
        href="https://mui.com/store/items/aurora/"
        size="medium"
        variant="text"
        color="neutral"
        sx={{ p: 1.5, color: 'common.white', opacity: 1 }}
        component="a"
        {...{ target: '_blank', rel: 'noopener noreferrer' }}
      >
        Purchase
      </NeutralButton>
    </Stack>
  );
};

export default HeaderNav;
