import { Box, Stack, Typography } from '@mui/material';

const colorOptions = [
  { name: 'Red', variants: ['#E17286', '#D02241', '#B11D37'] },
  { name: 'Orange', variants: ['#F8A250', '#F68D2A', '#DD6028'] },
  { name: 'Yellow', variants: ['#FAE17A', '#F8CE46', '#E8B73E'] },
  { name: 'Green', variants: ['#35B084', '#099F69', '#066F49'] },
  { name: 'Blue', variants: ['#589BF3', '#3385F0', '#2B71CC'] },
  { name: 'Purple', variants: ['#C78CF9', '#A641FA', '#742DAF'] },
];

const ColorOptions = () => {
  return (
    <>
      <Stack sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
        {colorOptions.map((option) => (
          <Stack key={option.name} direction="column" alignItems="center" width={1}>
            {option.variants.map((color) => (
              <Box
                key={color}
                sx={{
                  height: 24,
                  width: 1,
                  bgcolor: color,
                }}
              />
            ))}
          </Stack>
        ))}
      </Stack>
      <Stack>
        {colorOptions.map((option) => (
          <Typography
            key={option.name}
            variant="caption"
            sx={{ color: 'text.secondary', width: 1, textAlign: 'center' }}
          >
            {option.name}
          </Typography>
        ))}
      </Stack>
    </>
  );
};

export default ColorOptions;
