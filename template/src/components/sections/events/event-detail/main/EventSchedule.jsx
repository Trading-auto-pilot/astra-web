import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import Image from 'components/base/Image';
import ScrollSpyContent from 'components/scroll-spy/ScrollSpyContent';

const EventSchedule = ({ schedule }) => {
  const { topbarHeight } = useNavContext();

  return (
    <Grid container spacing={{ xs: 4, md: 6, xl: 10 }}>
      <Grid size={{ xs: 12, xl: 6 }}>
        <div>
          <ScrollSpyContent
            id="details"
            sx={(theme) => ({
              scrollMarginTop: theme.mixins.topOffset(topbarHeight, 75, true),
            })}
          >
            <Typography variant="h6" sx={{ my: 3, lineHeight: 1.5 }}>
              Details
            </Typography>
          </ScrollSpyContent>
          <Stack direction="column" sx={{ gap: { xs: 2.5, sm: 1 }, mb: 3 }}>
            {schedule.info.map((item) => (
              <Stack
                key={item.label}
                direction={{ xs: 'column', sm: 'row' }}
                sx={{
                  gap: 1,
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'background.elevation1',
                    px: 2,
                    py: 1,
                    width: { sm: 150 },
                  }}
                >
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    px: 2,
                    py: 1,
                    bgcolor: 'background.elevation1',
                  }}
                >
                  <Typography color="text.secondary">{item.time}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </div>
      </Grid>
      <Grid size={{ xs: 12, xl: 6 }}>
        <Image
          src={schedule.image.src}
          alt={schedule.image.alt}
          sx={({ mixins }) => ({
            width: 1,
            objectFit: 'cover',
            height: 246,
            borderRadius: 6,
            position: 'sticky',
            top: mixins.topOffset(topbarHeight, 75, true),
          })}
        />
      </Grid>
    </Grid>
  );
};

export default EventSchedule;
