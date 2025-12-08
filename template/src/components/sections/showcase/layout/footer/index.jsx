import { Link, Stack, Typography } from '@mui/material';
import { footerNavItems } from 'data/showcase';
import RevealText from '../../common/RevealText';

const ShowcaseFooter = () => {
  return (
    <Stack
      sx={(theme) => ({
        alignItems: 'center',
        justifyContent: 'space-between',
        p: theme.spacing(2, 5, 5, 5),
        flexDirection: { xs: 'column', sm: 'row' },
        rowGap: 2,
      })}
    >
      <RevealText start="top 100%">
        <Typography variant="subtitle2" color="common.white" fontWeight={400}>
          Brought to you by{' '}
          <Link
            href="https://themewagon.com/"
            target="_blank"
            sx={{ color: 'inherit', fontWeight: 700 }}
          >
            ThemeWagon
          </Link>{' '}
          💚
        </Typography>
      </RevealText>

      <Stack spacing={2}>
        {footerNavItems.map(({ label, to }, index) => (
          <RevealText key={label} start="top 100%" delay={index * 0.1}>
            <Link
              href={to}
              target="_blank"
              variant="subtitle2"
              sx={{ color: 'common.white', fontWeight: 600 }}
            >
              {label}
            </Link>
          </RevealText>
        ))}
      </Stack>
    </Stack>
  );
};

export default ShowcaseFooter;
