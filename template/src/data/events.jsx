import { List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { initialConfig } from 'config';

const image = (name) => `${initialConfig.assetsDir}/images/events/${name}.webp`;

export const eventInfo = {
  title: '“Louder Together” A Musical Night with Nemesis and Cryptic Fate',
  date: 'Saturday, 29 May, 2024',
  startTime: '5:00pm',
  endTime: '10:00pm',
  organizerName: 'Rocker’s Heaven',
  location: 'Maverick Convention Center, 56335 Ardella Greens Apt. 511, East Maeville, Arizona',
  mapLink: '#!',
};

export const description = {
  content: (
    <>
      <Typography variant="body1" sx={{ fontWeight: 700, mb: 3, color: 'text.secondary' }}>
        🌟 Louder Together: NightSky & Dawn 🌟
      </Typography>
      <Typography variant="body1">
        Get ready for an otherworldly musical journey as the celestial forces align! 🎶 On a
        star-studded night, the bands NightSky and Dawn will collide in an unforgettable concert
        experience that transcends time and space.
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 700, my: 3 }}>
        What to Expect:
      </Typography>
      <List dense disablePadding sx={{ mt: 3 }}>
        <ListItem disablePadding disableGutters sx={{ mb: 2 }}>
          <ListItemText
            disableTypography
            sx={{ m: 0 }}
            primary={
              <Stack sx={{ columnGap: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: 'text.secondary',
                  }}
                >
                  1.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                  }}
                >
                  <Typography
                    component="span"
                    variant={'subtitle1'}
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 700,
                      display: 'inline-block',
                      mr: 0.5,
                    }}
                  >
                    Harmonious Convergence:
                  </Typography>
                  NightSky’s ethereal melodies will blend seamlessly with Dawn’s uplifting rhythms.
                  Imagine the Milky Way itself swaying to their cosmic tunes.
                </Typography>
              </Stack>
            }
          />
        </ListItem>
        <ListItem disablePadding disableGutters sx={{ mb: 2 }}>
          <ListItemText
            disableTypography
            sx={{ m: 0 }}
            primary={
              <Stack sx={{ columnGap: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: 'text.secondary',
                  }}
                >
                  2.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                  }}
                >
                  <Typography
                    component="span"
                    variant={'subtitle1'}
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 700,
                      display: 'inline-block',
                      mr: 0.5,
                    }}
                  >
                    Stellar Setlists:
                  </Typography>{' '}
                  NightSky will unveil their latest nebula-inspired compositions, while Dawn will
                  ignite the stage with their sun-kissed anthems. Hits like “Galactic Serenade” and
                  “Aurora Borealis” are bound to leave you spellbound.
                </Typography>
              </Stack>
            }
          />
        </ListItem>
        <ListItem disablePadding disableGutters sx={{ mb: 2 }}>
          <ListItemText
            disableTypography
            sx={{ m: 0 }}
            primary={
              <Stack sx={{ columnGap: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: 'text.secondary',
                  }}
                >
                  3.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                  }}
                >
                  <Typography
                    component="span"
                    variant={'subtitle1'}
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 700,
                      display: 'inline-block',
                      mr: 0.5,
                    }}
                  >
                    Interstellar Visuals:
                  </Typography>{' '}
                  Brace yourself for mesmerizing visuals projected onto a holographic dome. Nebulas,
                  shooting stars, and celestial ballets will dance in harmony with the music.
                </Typography>
              </Stack>
            }
          />
        </ListItem>
        <ListItem disablePadding disableGutters>
          <ListItemText
            disableTypography
            sx={{ m: 0 }}
            primary={
              <Stack sx={{ columnGap: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: 'text.secondary',
                  }}
                >
                  4.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                  }}
                >
                  <Typography
                    component="span"
                    variant={'subtitle1'}
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 700,
                      display: 'inline-block',
                      mr: 0.5,
                    }}
                  >
                    Cosmic Attire:
                  </Typography>{' '}
                  Attendees are encouraged to dress in celestial-themed attire. Think shimmering
                  sequins, metallic hues, and galaxy prints. After all, you’re not just attending a
                  concert—you’re embarking on a cosmic voyage.
                </Typography>
              </Stack>
            }
          />
        </ListItem>
      </List>

      <Typography variant="body1" sx={{ fontWeight: 700, my: 3 }}>
        Why “Louder Together”?
      </Typography>
      <Typography variant="body1">
        Because when NightSky and Dawn collide, the universe itself resonates. Their harmonies echo
        across light-years, uniting stardust souls in a symphony of cosmic proportions. Remember,
        the night belongs to the dreamers, the stargazers, and those who seek magic beyond the
        horizon. NightSky. Dawn. Louder Together. 🌌✨
      </Typography>
    </>
  ),
  image: image('details/2'),
};

export const schedule = {
  info: [
    {
      label: 'Gate Open',
      time: '4:30pm',
    },
    {
      label: 'Event Start',
      time: '05:30pm',
    },
    {
      label: 'Event End',
      time: '09:30pm',
    },
  ],
  image: { src: image('details/3'), alt: 'Event banner with performers' },
};

export const performerList = {
  performers: [
    'Band 1',
    'Band 2',
    'Band 3',
    'Band 4',
    'Band 5',
    'NightSky',
    'Dawn',
    'Mystery appearance ✨',
  ],
  image: { src: image('details/4'), alt: 'Band1 performing on stage' },
};

export const organizerEvents = [
  {
    id: 1,
    title: 'Galactic Ice Cream Festival',
    image: image('1'),
    priceRange: '$50 - $300',
    description: 'Experience an unforgettable evening with live performances from top artists.',
    date: 'Monday, 2 Dec, 2024',
    time: '5:00pm - 10:00pm',
    location: 'Arizona, USA',
  },
  {
    id: 2,
    title: 'Neon Lantern Parade',
    image: image('2'),
    priceRange: '$20 - $250',
    description: 'Join us to explore your creativity with hands-on art activities for all levels.',
    date: 'Thursday, 16 Dec, 2024',
    time: '6:00pm - 10:00pm',
    location: 'New York, USA',
  },
  {
    id: 3,
    title: 'Mystery Puzzle Race',
    image: image('3'),
    priceRange: '$10 - $200',
    description:
      'Discover the latest advancements in technology and network with industry leaders.',
    date: 'Monday, 20 Dec, 2024',
    time: '5:00pm - 12:00pm',
    location: 'Dothan, USA',
  },
  {
    id: 4,
    title: 'Robot Talent Show',
    image: image('details/3'),
    priceRange: '$10 - $150',
    description: 'Savor a variety of gourmet dishes prepared by renowned chefs.',
    date: 'Sunday, 13 October, 2024',
    time: '5:00pm - 10:00pm',
    location: 'LA, USA',
  },
];

export const organizerInfo = {
  name: 'Rocker’s Heaven',
  followers: 2400,
  phone: '+362-124-62326',
  email: 'eventorganizer@email.com',
  description:
    "Rockers' Heaven is your go-to for unforgettable events. We specialize in music festivals, concerts, and corporate gatherings, ensuring every detail is perfect. Let us create experiences that resonate and leave lasting memories. 🎸✨",
};

export const eventTermsConditions = {
  terms: [
    {
      id: 1,
      description: 'No printed copy will be allowed at the venue entry.',
    },
    {
      id: 2,
      description: 'Each ticket is valid for only one person.',
    },
    {
      id: 3,
      description: 'You must provide a valid ticket to gain access to the event.',
    },
    {
      id: 4,
      description:
        'At entry, ticket holders need to show valid photo identification. One must carry photo identification on the event day.',
    },
    {
      id: 5,
      description:
        'A token of verification will be provided at the entry. Without it, the audience will not be allowed to enter, and it will be considered unacceptable for entry if damaged or missing.',
    },
    {
      id: 6,
      description:
        'Any kind of alcohol, drugs, tobacco products, and intoxicants are strictly prohibited inside the venue. Violation of this rule can invoke necessary actions by the authority.',
    },
    {
      id: 7,
      description:
        'If any individual seems like a security threat or creates any disturbance, the organizers reserve the right to refuse entry or remove them from the event premises.',
    },
    {
      id: 8,
      description:
        'The organizers reserve the right to conduct security searches and confiscate any item that may cause danger or disturbance to other audience members and if deemed a security threat.',
    },
    {
      id: 9,
      description:
        'CCTV and film cameras will be operational at the venue. Attending the event signifies agreement to filming and recording without any objections.',
    },
    {
      id: 10,
      description:
        'The organizers will not take responsibility for the loss or theft of any personal belongings.',
    },
    {
      id: 11,
      description:
        'Electrical devices such as mobile phone chargers, Bluetooth speakers, power banks, and electronic cigarettes are strictly prohibited.',
    },
    {
      id: 12,
      description:
        'No bags will be allowed inside the venue. Women are specifically requested not to bring purses larger than 10 inches by 6 inches.',
    },
    {
      id: 13,
      description: 'No sharp, pointed, or weaponry objects are allowed at the venue.',
    },
    {
      id: 14,
      description:
        'No outside food or drinks will be allowed. Food and drinks will be available at the venue.',
    },
    {
      id: 15,
      description:
        'Each ticket holder will be assigned a designated zone. Shifting zones is prohibited, and necessary actions will be taken for violations.',
    },
    {
      id: 16,
      description: 'Tickets cannot be refunded unless the event is canceled.',
    },
    {
      id: 17,
      description:
        'It is your responsibility to ascertain whether an event has been canceled or rescheduled, and to check the date and time of any rescheduled event.',
    },
    {
      id: 18,
      description:
        'Organizers reserve the right to make amendments regarding the event and ticket holders without prior notice.',
    },
    {
      id: 19,
      description:
        'There will be no parking facility from the organizers. If available from the venue authority, you may redeem the service on your own accord.',
    },
  ],
  images: [
    { id: 1, src: image('details/5'), alt: 'Band1 performing on stage' },
    { id: 2, src: image('details/6'), alt: 'Band2 rocking the crowd' },
  ],
};
