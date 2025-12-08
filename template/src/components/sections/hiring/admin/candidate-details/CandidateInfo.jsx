import {
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from '@mui/material';

const CandidateInfo = ({ contact, jobPreferences, experiences, education }) => {
  return (
    <Grid container spacing={3}>
      <Grid
        container
        rowSpacing={{ sm: 1, md: 0 }}
        columns={{ xs: 1, sm: 2, md: 1 }}
        component={List}
        size={12}
        disablePadding
      >
        <Grid size={1}>
          <InfoItem
            primary="Email"
            secondary={<Link href={`mailto:${contact.email}`}>{contact.email}</Link>}
          />
        </Grid>
        <Grid size={1}>
          <InfoItem sx={{ flexBasis: '50%' }} primary="Phone No" secondary={contact.phone} />
        </Grid>
        <Grid size={1}>
          <InfoItem primary="Address" secondary={contact.address} />
        </Grid>
        <Grid size={1}>
          <InfoItem primary="Desired Salary" secondary={jobPreferences.desiredSalary} />
        </Grid>
        <Grid size={1}>
          <InfoItem primary="Referred By" secondary={jobPreferences.referredBy} />
        </Grid>
        <Grid size={1}>
          <InfoItem
            primary="Website/Portfolio"
            secondary={<Link href="#!">{contact.website}</Link>}
          />
        </Grid>
      </Grid>

      <Grid
        component={List}
        size={{ xs: 12, sm: 6, md: 12 }}
        disablePadding
        subheader={
          <ListSubheader component="div" disableGutters sx={{ bgcolor: 'transparent', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} color="textPrimary">
              Experiences
            </Typography>
          </ListSubheader>
        }
      >
        {experiences.map((experience) => (
          <InfoItem
            key={experience.title}
            primary={experience.title}
            secondary={
              <Stack component="span" direction="column" gap={1}>
                <Typography component="span" variant="body2" color="textSecondary" fontWeight={500}>
                  {experience.company}
                </Typography>
                <Typography component="span" variant="caption" color="textSecondary">
                  ({experience.duration})
                </Typography>
              </Stack>
            }
            primaryProps={{
              color: 'text.secondary',
              mb: 0.5,
            }}
          />
        ))}
      </Grid>

      <Grid
        component={List}
        size={{ xs: 12, sm: 6, md: 12 }}
        disablePadding
        subheader={
          <ListSubheader component="div" disableGutters sx={{ bgcolor: 'transparent', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} color="textPrimary">
              Education
            </Typography>
          </ListSubheader>
        }
      >
        {education.map((edu) => (
          <InfoItem
            key={edu.degree}
            primary={edu.degree}
            secondary={
              <Stack component="span" direction="column" gap={1}>
                <Typography component="span" variant="body2" color="textSecondary" fontWeight={500}>
                  {edu.institution}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  ({edu.duration})
                </Typography>
              </Stack>
            }
            primaryProps={{
              color: 'text.secondary',
              mb: 0.5,
            }}
          />
        ))}
      </Grid>
    </Grid>
  );
};

const InfoItem = ({ primary, secondary, primaryProps, secondaryProps, props, sx }) => {
  return (
    <ListItem disableGutters sx={{ ...sx }}>
      <ListItemText
        primary={primary}
        secondary={secondary}
        sx={{ my: 1 }}
        slotProps={{
          primary: {
            sx: {
              mb: 1,
              typography: 'subtitle1',
              fontWeight: 700,
              display: 'block',

              ...primaryProps,
            },
          },
          secondary: {
            sx: {
              display: 'block',
              typography: 'body1',
              ...secondaryProps,
            },
          },
        }}
        {...props}
      />
    </ListItem>
  );
};

export default CandidateInfo;
