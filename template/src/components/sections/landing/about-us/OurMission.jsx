import { useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Container, Grid, Stack, Tab, Typography } from '@mui/material';
import bg from 'assets/images/background/4.webp';
import { useThemeMode } from 'hooks/useThemeMode';
import { useSettingsContext } from 'providers/SettingsProvider';
import RevealImage from '../common/RevealImage';
import SectionHeader from '../common/SectionHeader';

const tabContent = (
  <Stack direction="column" gap={2}>
    <Typography variant="h6">Our Goal</Typography>

    <Typography variant="body2" color="textSecondary">
      We believe a connected team is a powerful asset, no matter their location. Our mission is to
      empower remote teams with the tools and insights they need to collaborate seamlessly, stay
      productive, and reach their full potential. We are dedicated to breaking down barriers and
      fostering a work environment where every individual feels supported and engaged.
    </Typography>

    <Typography variant="body2" color="textSecondary">
      Our approach goes beyond providing simple software. We are focused on helping you build a
      strong foundation of communication and trust. We believe that by enabling a more fluid and
      efficient way of working, we can help you unlock a level of collaboration and innovation that
      was once only possible in a physical office.
    </Typography>

    <Typography variant="body2" color="textSecondary">
      We are committed to helping you navigate the complexities of remote work. Our tools integrate
      effortlessly into your existing workflows, and we offer dedicated support to ensure your
      team's success. Because every business is unique, we provide flexible, customizable solutions
      tailored to your specific needs.
    </Typography>

    <Typography variant="body2" color="textSecondary">
      Ultimately, when your team thrives, your business thrives. Our goal is to be your partner in
      building a resilient, high-performing team that is ready for the future of work.
    </Typography>

    <Typography variant="h6">We are here for your needs!</Typography>

    <Typography variant="body2" color="textSecondary">
      We understand that the demands of the modern workplace require a partner who gets it. We've
      built our platform to be your go-to resource for all things remote work. Our solutions are
      designed to address your specific needs, whether you're solving complex communication issues,
      optimizing collaboration, or simply making daily tasks easier for your team.
    </Typography>

    <Typography variant="body2" color="textSecondary">
      We are not merely a software provider; we see ourselves as your strategic ally in cultivating
      a dynamic, efficient, and future-ready remote team. Our commitment goes beyond just offering
      tools; we provide ongoing support and a steadfast dedication to your success. This ensures
      that you can tackle any challenge with confidence. Our mission is to empower you in creating a
      high-performing and satisfied workforce that thrives in today’s ever-evolving landscape.
    </Typography>
  </Stack>
);

const OurMission = ({ sx }) => {
  const {
    config: { assetsDir },
  } = useSettingsContext();
  const { isDark } = useThemeMode();
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        background: `url(${bg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom left',

        ...sx,
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: 1000, px: { xs: 0 }, py: { xs: 5, sm: 8 } }}>
        <Grid container>
          <Grid size={6} sx={{ py: 5, display: { xs: 'none', md: 'block' } }}>
            <RevealImage>
              <Box
                sx={{
                  position: 'sticky',
                  top: 96,
                  width: 1,
                  transform: 'translateX(40px)',
                  aspectRatio: '16/12',
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8,
                  boxShadow: (theme) => theme.vars.shadows[4],
                  background: `url(${isDark ? `${assetsDir}/images/landing/hero/1-dark.webp` : `${assetsDir}/images/landing/hero/1.webp`})`,

                  backgroundSize: 'cover',
                  backgroundPosition: 'top left',
                }}
              />
            </RevealImage>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                height: 1,
                width: 1,
                position: 'relative',
                zIndex: 10,
                bgcolor: { md: 'background.paper' },
                p: { xs: 3, md: 5 },
                boxShadow: { md: '-40px 0px 70px -60px rgba(0,0,0,0.25)' },
              }}
            >
              <SectionHeader
                subtitle="On a mission to empower remote teams"
                title="MORE ABOUT US"
                sx={{ textAlign: { xs: 'center', md: 'left' }, mb: 5 }}
              />

              <TabContext value={value}>
                <TabList onChange={handleChange}>
                  <Tab label="Our goal" value="1" />
                  <Tab label="Our approach" value="2" />
                  <Tab label="Our strength" value="3" />
                </TabList>
                <TabPanel value="1" sx={{ px: 0 }}>
                  {tabContent}
                </TabPanel>
                <TabPanel value="2" sx={{ px: 0 }}>
                  {tabContent}
                </TabPanel>
                <TabPanel value="3" sx={{ px: 0 }}>
                  {tabContent}
                </TabPanel>
              </TabContext>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default OurMission;
