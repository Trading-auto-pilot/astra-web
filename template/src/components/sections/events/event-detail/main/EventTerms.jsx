import { Box, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import Image from 'components/base/Image';
import ScrollSpyContent from 'components/scroll-spy/ScrollSpyContent';

const EventTerms = ({ eventTermsConditions }) => {
  const { topbarHeight } = useNavContext();

  return (
    <Grid container spacing={{ xs: 4, md: 6, xl: 10 }}>
      <Grid size={{ xs: 12, xl: 6 }}>
        <div>
          <ScrollSpyContent
            id="terms"
            sx={(theme) => ({
              scrollMarginTop: theme.mixins.topOffset(topbarHeight, 75, true),
            })}
          >
            <Typography variant="h6" sx={{ my: 3 }}>
              Event Terms & Conditions
            </Typography>
          </ScrollSpyContent>
          <List disablePadding>
            {eventTermsConditions.terms.map((term) => (
              <ListItem key={term.id} disableGutters>
                <ListItemText
                  primary={
                    <Typography variant="body1" color="text.secondary">
                      {term.id}. {term.description}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Grid>

      <Grid size={{ xs: 12, xl: 6 }}>
        <Stack
          direction="column"
          gap={2}
          sx={({ mixins }) => ({
            height: mixins.contentHeight(topbarHeight, mixins.footer.sm + 115),
            position: 'sticky',
            top: mixins.topOffset(topbarHeight, 75, true),
          })}
        >
          {eventTermsConditions.images.map((image) => (
            <Box
              key={image.id}
              sx={{
                flex: 1,
                overflow: 'hidden',
                borderRadius: 6,
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                sx={{
                  width: 1,
                  height: 1,
                  objectFit: 'cover',
                }}
              />
            </Box>
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default EventTerms;
