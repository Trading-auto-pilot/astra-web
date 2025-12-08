import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import Image from 'components/base/Image';
import ScrollSpyContent from 'components/scroll-spy/ScrollSpyContent';

const EventDescription = ({ description }) => {
  const { topbarHeight } = useNavContext();

  return (
    <Grid container spacing={{ xs: 4, md: 6, xl: 10 }} justifyContent="center">
      <Grid size={{ xs: 12, xl: 6 }}>
        <ScrollSpyContent
          id="description"
          sx={(theme) => ({
            scrollMarginTop: theme.mixins.topOffset(topbarHeight, 75, true),
          })}
        >
          <Typography variant="h6" sx={{ my: 3, lineHeight: 1.5 }}>
            Description
          </Typography>
        </ScrollSpyContent>
        <Box sx={{ mb: 3 }}>{description.content}</Box>
      </Grid>

      <Grid size={{ xs: 12, xl: 6 }}>
        <Box
          sx={({ mixins }) => ({
            height: {
              xs: 680,
              sm: ({ mixins }) => mixins.contentHeight(topbarHeight, mixins.footer.sm + 115),
            },
            position: 'sticky',
            top: mixins.topOffset(topbarHeight, 75, true),
          })}
        >
          <Image
            src={description?.image}
            alt=""
            sx={{
              width: 1,
              height: 1,
              objectFit: 'cover',
              borderRadius: 6,
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default EventDescription;
