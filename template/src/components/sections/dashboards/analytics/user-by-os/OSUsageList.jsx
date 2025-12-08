import { Box, Stack, Typography } from '@mui/material';

const categoryColors = {
  Desktop: 'chBlue.200',
  Tablet: 'chLightBlue.200',
  Mobile: 'chOrange.200',
};

const OSCategory = ({ category }) => {
  const bgColor = categoryColors[category.name] || 'grey.300';

  return (
    <Box sx={{ position: 'relative', width: 1, height: 1 }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 4,
          height: '100%',
          borderRadius: 0.5,
          bgcolor: bgColor,
          flexShrink: 0,
        }}
      />

      <Stack direction="column" justifyContent="space-between" height={1} gap={0.5} py={1} pl={3}>
        {category.children &&
          category.children.map((item) => (
            <Typography
              key={item.name}
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box component="span" width={80}>
                {item.name}
              </Box>
              {item.value}%
            </Typography>
          ))}
      </Stack>
    </Box>
  );
};

const OSUsageList = ({ data }) => {
  return (
    <Stack
      sx={{
        flexDirection: { xs: 'row', sm: 'column', md: 'row', xl: 'column' },
        width: 1,
        justifyContent: 'space-between',
        rowGap: 1,
        columnGap: 3,
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        alignItems: { xs: 'center', sm: 'unset' },
        maxWidth: { sm: 300, md: 1, xl: 156 },
      }}
    >
      <Stack
        sx={{
          flexDirection: 'column',
          gap: 1,
          flex: 1,
        }}
      >
        <OSCategory category={data[0]} />
        <OSCategory category={data[1]} />
      </Stack>

      <Box sx={{ flex: 1 }}>
        <OSCategory category={data[2]} />
      </Box>
    </Stack>
  );
};

export default OSUsageList;
