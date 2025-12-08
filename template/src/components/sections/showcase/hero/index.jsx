import { useRef } from 'react';
import { Box } from '@mui/material';
import HeroContent from './HeroContent';
import HeroMedia from './HeroMedia';
import { useHeroAnimation } from './useHeroAnimation';

const ShowcaseHero = () => {
  const refs = {
    section: useRef(null),
    media: useRef(null),
    text: useRef(null),
    techStack: useRef(null),
    buttons: useRef(null),
  };

  useHeroAnimation(refs);

  return (
    <Box ref={refs.section} sx={{ position: 'relative', overflow: 'hidden' }}>
      <HeroMedia ref={refs.media} />
      <HeroContent textRef={refs.text} techStackRef={refs.techStack} buttonsRef={refs.buttons} />
    </Box>
  );
};

export default ShowcaseHero;
