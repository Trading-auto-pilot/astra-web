import { Box, Stack, Tooltip, Typography, boxClasses, capitalize, useTheme } from '@mui/material';

const getBgColor = (palette, value) => {
  let bgColor = palette.primary.main;

  if (value <= 10) {
    bgColor = palette.chBlue[500];
  } else if (value <= 20 && value > 10) {
    bgColor = palette.chBlue[200];
  } else if (value <= 30 && value > 20) {
    bgColor = palette.chGrey[300];
  } else if (value <= 40 && value > 30) {
    bgColor = palette.chGrey[200];
  } else if (value <= 50 && value > 40) {
    bgColor = palette.chBlue[300];
  }

  return bgColor;
};

const StorageBar = ({ storages }) => {
  const theme = useTheme();

  return (
    <div>
      <Stack
        sx={{
          alignItems: 'center',
          height: 8,
          mb: 2,
        }}
      >
        {storages.map((storage, index) => (
          <Tooltip title={storage.label} arrow key={storage.label}>
            <Box
              sx={{
                width: `${storage.value + 8}%`,
                background: theme.vars.palette.background.default,
                p: 0.5,
                mx: -0.5,
                '&:hover': {
                  borderRadius: 2,
                  zIndex: 1,
                  boxShadow: theme.vars.shadows[1],
                  [`& .${boxClasses.root}`]: {
                    borderRadius: 2,
                    height: 10,
                  },
                },
              }}
            >
              <Box
                sx={[
                  {
                    height: 8,
                  },
                  {
                    width: 1,
                    background: (theme) => getBgColor(theme.vars.palette, storage.value),
                  },
                  index === 0 && {
                    borderRadius: '8px 0 0 8px',
                  },
                  index === storages.length - 1 && {
                    borderRadius: '0 8px 8px 0',
                  },
                ]}
              />
            </Box>
          </Tooltip>
        ))}
      </Stack>
      <Stack spacing={3}>
        {storages.map((storage) => (
          <Stack
            spacing={1}
            key={storage.label}
            sx={{
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                background: (theme) => getBgColor(theme.vars.palette, storage.value),
                borderRadius: 0.5,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 500,
                color: 'text.secondary',
              }}
            >
              {capitalize(storage.label)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </div>
  );
};

export default StorageBar;
