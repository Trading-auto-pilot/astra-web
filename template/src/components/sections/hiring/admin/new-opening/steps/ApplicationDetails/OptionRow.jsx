import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const OptionRow = ({ field, label }) => {
  return (
    <Stack
      component={RadioGroup}
      gap={1}
      sx={{ px: { xs: 1, sm: 3 }, py: 1, height: 64 }}
      {...field}
    >
      <Stack direction="column" justifyContent="center" sx={{ flexGrow: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          {label}
        </Typography>
      </Stack>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ flexBasis: { xs: '17.5%', sm: '20%' }, textAlign: 'center' }}
      >
        <FormControlLabel value="required" control={<Radio />} label="" sx={{ mr: 0 }} />
      </Stack>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ flexBasis: { xs: '17.5%', sm: '20%' }, textAlign: 'center' }}
      >
        <FormControlLabel value="optional" control={<Radio />} label="" sx={{ mr: 0 }} />
      </Stack>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ flexBasis: { xs: '17.5%', sm: '20%' }, textAlign: 'center' }}
      >
        <FormControlLabel value="disabled" control={<Radio />} label="" sx={{ mr: 0 }} />
      </Stack>
    </Stack>
  );
};

export default OptionRow;
