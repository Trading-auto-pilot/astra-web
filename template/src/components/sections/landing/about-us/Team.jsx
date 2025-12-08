import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { initialConfig } from 'config';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import Image from 'components/base/Image';
import RevealItems from '../common/RevealItems';
import SectionHeader from '../common/SectionHeader';

const members = [
  {
    id: 1,
    name: 'Madeline Wuntch',
    designation: 'CEO & Founder',
    image: `${initialConfig.assetsDir}/images/landing/team/1.webp`,
  },
  {
    id: 2,
    name: 'Sophia Perez',
    designation: 'Lead Developer',
    image: `${initialConfig.assetsDir}/images/landing/team/2.webp`,
  },
  {
    id: 3,
    name: 'Terry Jeffords',
    designation: 'Product Manager',
    image: `${initialConfig.assetsDir}/images/landing/team/3.webp`,
  },
  {
    id: 4,
    name: 'Jake Peralta',
    designation: 'UI/UX Designer',
    image: `${initialConfig.assetsDir}/images/landing/team/4.webp`,
  },
  {
    id: 5,
    name: 'Amy Santiago',
    designation: 'Backend Engineer',
    image: `${initialConfig.assetsDir}/images/landing/team/5.webp`,
  },
  {
    id: 6,
    name: 'Rosa Diaz',
    designation: 'DevOps Engineer',
    image: `${initialConfig.assetsDir}/images/landing/team/6.webp`,
  },
  {
    id: 7,
    name: 'Gina Linetti',
    designation: 'Marketing Director',
    image: `${initialConfig.assetsDir}/images/landing/team/7.webp`,
  },
  {
    id: 8,
    name: 'Raymond Holt',
    designation: 'CTO',
    image: `${initialConfig.assetsDir}/images/landing/team/8.webp`,
  },
  {
    id: 9,
    name: 'Charles Boyle',
    designation: 'QA Engineer',
    image: `${initialConfig.assetsDir}/images/landing/team/9.webp`,
  },
  {
    id: 10,
    name: 'Kevin Cozner',
    designation: 'Data Scientist',
    image: `${initialConfig.assetsDir}/images/landing/team/10.webp`,
  },
];

const Team = ({ diamond = false, sx }) => {
  const { up } = useBreakpoints();
  const upMd = up('md');

  return (
    <Box sx={{ px: { xs: 3, md: 5 }, pt: 8, pb: { xs: 5, sm: 16 }, ...sx }}>
      <Container maxWidth={false} sx={{ maxWidth: 946, px: { xs: 0 } }}>
        <Stack direction="column" gap={3}>
          <SectionHeader subtitle="Our brilliant teammates" title="TEAM" />

          {diamond ? (
            upMd ? (
              <RevealItems
                component={Grid}
                y={0}
                container
                columns={5}
                spacing={{ xs: 2, md: 3 }}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                <Grid size={1} container sx={{ placeContent: 'center' }}>
                  <Grid size={12}>
                    <Member member={members[0]} />
                  </Grid>
                </Grid>
                <Grid size={1} container sx={{ placeContent: 'center' }} columnSpacing={4}>
                  <Grid size={12}>
                    <Member member={members[1]} />
                  </Grid>
                  <Grid size={12}>
                    <Member member={members[2]} />
                  </Grid>
                </Grid>
                <Grid size={1} container sx={{ placeContent: 'center' }} columnSpacing={4}>
                  <Grid size={12}>
                    <Member member={members[3]} />
                  </Grid>
                  <Grid size={12}>
                    <Member member={members[4]} />
                  </Grid>
                  <Grid size={12}>
                    <Member member={members[5]} />
                  </Grid>
                </Grid>
                <Grid size={1} container sx={{ placeContent: 'center' }} columnSpacing={4}>
                  <Grid size={12}>
                    <Member member={members[6]} />
                  </Grid>
                  <Grid size={12}>
                    <Member member={members[7]} />
                  </Grid>
                </Grid>
                <Grid size={1} container sx={{ placeContent: 'center' }} columnSpacing={4}>
                  <Grid size={12}>
                    <Member member={members[8]} />
                  </Grid>
                </Grid>
              </RevealItems>
            ) : (
              <Grid
                container
                columns={3}
                columnSpacing={{ xs: 1, sm: 3 }}
                rowSpacing={{ xs: 3, sm: 4 }}
              >
                {members.slice(0, 9).map((member) => (
                  <Grid size={1} key={member.id}>
                    <Member member={member} />
                  </Grid>
                ))}
              </Grid>
            )
          ) : (
            <Grid
              container
              columns={{ xs: 3, md: 5 }}
              columnSpacing={{ xs: 1, sm: 3 }}
              rowSpacing={{ xs: 3, sm: 4 }}
            >
              {(upMd ? members : members.slice(0, 9)).map((member) => (
                <Grid size={1} key={member.id}>
                  <Member member={member} />
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

const Member = ({ member }) => {
  return (
    <Box sx={{ width: 1 }}>
      <Box
        sx={{
          position: 'relative',
          width: 1,
          aspectRatio: '17 / 25',
          borderRadius: 4,
          overflow: 'hidden',
          bgcolor: 'background.elevation1',
          mb: 2,
        }}
      >
        <Box
          sx={{
            filter: 'grayscale(100%)',
            transition: (theme) =>
              theme.transitions.create('filter', {
                duration: theme.transitions.duration.standard,
              }),
            '&:hover': {
              filter: 'grayscale(0%)',
            },
          }}
        >
          <Image
            src={member.image}
            alt={member.name}
            sx={{
              width: 1,
              height: 1,
            }}
          />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            width: 1,
            height: 1,
            left: 0,
            bottom: 0,
            pointerEvents: 'none',
            userSelect: 'none',
            background: (theme) =>
              `/* @noflip */ linear-gradient(to bottom, transparent 70%, ${theme.vars.palette.background.elevation1})`,
          }}
        />
      </Box>

      <Stack gap={0.5} direction="column" alignItems="center" textAlign="center">
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{ fontSize: { xs: '10px', sm: '14px' } }}
        >
          {member.name}
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontSize: { xs: '8px', sm: '14px' } }}
        >
          {member.designation}
        </Typography>
      </Stack>
    </Box>
  );
};

export default Team;
