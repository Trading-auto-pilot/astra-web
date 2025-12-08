import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useNumberFormat from 'hooks/useNumberFormat';

const ProfileDetailCard = ({ title, value }) => {
  const { currencyFormat } = useNumberFormat();

  return (
    <Paper
      component={Stack}
      direction="column"
      sx={{
        px: { xs: 3, md: 5 },
        py: 2,
        height: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, textTransform: 'capitalize' }}>
        {title}
      </Typography>
      {typeof value === 'object' ? (
        <Typography component={Link} variant="subtitle2" href={value.link}>
          {value.name}
        </Typography>
      ) : (
        <Typography
          variant="subtitle2"
          sx={{
            color: 'text.secondary',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            width: 1,
          }}
        >
          {title === 'salary' ? currencyFormat(value, { maximumFractionDigits: 0 }) : value}
        </Typography>
      )}
    </Paper>
  );
};

export default ProfileDetailCard;
