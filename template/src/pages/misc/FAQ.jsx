import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import FaqProvider, { useFaqContext } from 'providers/FaqProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import ScrollSpy from 'components/scroll-spy';
import FaqDrawer from 'components/sections/misc/faq/FaqDrawer';
import FaqItems from 'components/sections/misc/faq/FaqItems';
import FaqPageHeader from 'components/sections/misc/faq/FaqPageHeader';
import FaqSidenav from 'components/sections/misc/faq/faq-sidenav/FaqSidenav';

const index = () => {
  return (
    <ScrollSpy offset={460}>
      <FaqProvider>
        <FAQ />
      </FaqProvider>
    </ScrollSpy>
  );
};

const FAQ = () => {
  const { handleDrawerOpen } = useFaqContext();
  const { topbarHeight } = useNavContext();

  return (
    <Stack direction="column" sx={{ height: 1 }}>
      <FaqPageHeader />
      <Paper
        sx={{
          px: 3,
          py: 2,
          position: 'sticky',
          top: topbarHeight,
          display: { xs: 'block', md: 'none' },
          zIndex: 1000,
        }}
      >
        <Button
          variant="soft"
          color="neutral"
          size="large"
          startIcon={
            <IconifyIcon
              icon="material-symbols:list-rounded"
              sx={{ fontSize: '1.5rem !important' }}
            />
          }
          onClick={handleDrawerOpen}
          sx={{ py: 1.5 }}
          fullWidth
        >
          List of categories
        </Button>
      </Paper>

      <FaqDrawer />

      <Stack height={1}>
        <Paper
          background={1}
          sx={(theme) => ({
            p: { md: 1, lg: 2 },
            width: { md: 320, lg: 405 },
            flexShrink: 0,
            position: 'sticky',
            top: topbarHeight,
            height: 1,
            maxHeight: theme.mixins.contentHeight(topbarHeight),
            display: { xs: 'none', md: 'block' },
            overflowY: 'scroll',
          })}
        >
          <FaqSidenav />
        </Paper>

        <Paper sx={{ px: 3, py: 5, flex: 1 }}>
          <FaqItems />
        </Paper>
      </Stack>
    </Stack>
  );
};

export default index;
