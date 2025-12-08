import { Grid, Rating, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const criteriaRatings = [
  {
    title: 'Professionalism',
    items: [
      { label: 'Punctual', rating: 5 },
      { label: 'Courteous', rating: 5 },
      { label: 'Communicator', rating: 5 },
      { label: 'Articulate', rating: 4 },
    ],
  },
  {
    title: 'Qualities',
    items: [
      { label: 'Emotional Intelligence', rating: 5 },
      { label: 'Honesty', rating: 5 },
      { label: 'Positivity', rating: 5 },
      { label: 'Curiosity', rating: 4 },
      { label: 'Self-Motivated', rating: 5 },
    ],
  },
  {
    title: 'Activities',
    items: [
      { label: 'Event Management', rating: 5 },
      { label: 'Speaker', rating: 5 },
      { label: 'Event Planning', rating: 5 },
    ],
  },
];

const RatingCriteria = () => {
  return (
    <Stack direction="column" gap={4}>
      {criteriaRatings.map((criteria) => {
        return (
          <div key={criteria.title}>
            <Typography variant="body1" fontWeight={700} color="textSecondary" mb={2}>
              {criteria.title}
            </Typography>

            <Grid container columnSpacing={{ xs: 1, xl: 2 }} rowSpacing={1}>
              {criteria.items.map((item) => (
                <Grid key={item.label} size={{ xs: 12, sm: 6, md: 12, lg: 6 }}>
                  <Stack
                    sx={{
                      bgcolor: 'background.elevation1',
                      borderRadius: 2,
                      width: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      px: 2,
                      py: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight={500} color="textSecondary">
                      {item.label}
                    </Typography>

                    <Rating
                      name="product-rating"
                      color="warning"
                      value={item.rating}
                      readOnly
                      icon={
                        <IconifyIcon
                          icon="material-symbols:star-rounded"
                          fontSize={24}
                          color="warning.main"
                        />
                      }
                      emptyIcon={
                        <IconifyIcon
                          icon="material-symbols:star-rounded"
                          fontSize={24}
                          color="divider"
                        />
                      }
                    />
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </div>
        );
      })}
    </Stack>
  );
};

export default RatingCriteria;
