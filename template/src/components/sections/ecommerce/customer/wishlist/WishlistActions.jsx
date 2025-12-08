import { Button, Stack } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';

const WishlistActions = () => {
  const { down } = useBreakpoints();
  const downSm = down('sm');

  return (
    <Stack
      sx={{
        gap: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 5,
      }}
    >
      <Button
        variant="soft"
        color="neutral"
        startIcon={<IconifyIcon icon="material-symbols:add-rounded" fontSize="20px !important" />}
      >
        Invite people
      </Button>

      <Button
        variant="soft"
        color="neutral"
        sx={{ ml: 'auto' }}
        shape={downSm ? 'square' : undefined}
      >
        <Stack
          sx={{
            gap: 1,
            alignItems: 'center',
          }}
        >
          <IconifyIcon icon="material-symbols:share-outline" fontSize={20} />

          {!downSm && 'Share list with others'}
        </Stack>
      </Button>
      <Button variant="soft" color="neutral">
        More
      </Button>
    </Stack>
  );
};

export default WishlistActions;
