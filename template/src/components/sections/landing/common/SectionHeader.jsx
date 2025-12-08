import { useTheme } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RevealText from './RevealText';

const SectionHeader = ({ title, subtitle, sx, ...rest }) => {
  const { direction } = useTheme();

  return (
    <Stack key={direction} direction="column" gap={1} sx={{ textAlign: 'center', ...sx }} {...rest}>
      <RevealText delay={0.2}>
        <Typography variant="overline" color="text.disabled" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </RevealText>

      <RevealText>
        <Typography variant="h4">{subtitle}</Typography>
      </RevealText>
    </Stack>
  );
};

export default SectionHeader;
