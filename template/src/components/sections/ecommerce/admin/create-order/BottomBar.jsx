import { Button, Paper, Stack } from '@mui/material';

const BottomBar = () => {
  return (
    <Paper
      component={Stack}
      background={1}
      sx={(theme) => ({
        position: 'sticky',
        zIndex: 10,
        bottom: 0,
        px: { xs: 3, md: 5 },
        height: theme.mixins.footer.sm,
        justifyContent: 'flex-end',
      })}
    >
      <Stack gap={1} sx={{ alignSelf: 'center' }}>
        <Button type="button" variant="soft" color="neutral">
          Save Draft
        </Button>
        <Button type="button" variant="contained">
          Create Order
        </Button>
      </Stack>
    </Paper>
  );
};

export default BottomBar;
