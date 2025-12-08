import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Box, Container } from '@mui/material';
import { showcaseAssets } from 'data/showcase';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import Image from 'components/base/Image';
import GradientText from '../common/GradientText';

gsap.registerPlugin(ScrollTrigger);

const ElegantCards = () => {
  const { up } = useBreakpoints();
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const imageRefs = useRef([]);
  const images = showcaseAssets.elegantCards;

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'center bottom',
          end: 'center center',
          scrub: 1,
        },
      });

      gsap.set([textRef.current, ...imageRefs.current.filter(Boolean)], {
        opacity: 0,
        scale: 1.8,
      });

      tl.to(textRef.current, { opacity: 1, scale: 1, ease: 'power2.out' }, 0);

      imageRefs.current.forEach((ref, i) => {
        if (ref) {
          tl.to(ref, { opacity: 1, scale: 1, ease: 'power2.out' }, 0.2 * (i + 1));
        }
      });
    },
    { scope: sectionRef },
  );

  return (
    <Box ref={sectionRef} sx={{ my: 15 }}>
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 1442,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ position: 'relative', width: 1, minWidth: '900px', aspectRatio: '16/9' }}>
          <GradientText
            variant={up('lg') ? 'h3' : 'h5'}
            ref={textRef}
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              textAlign: 'center',
            }}
          >
            Elegantly crafted cards
          </GradientText>

          {images.map((img, i) => (
            <Box
              key={i}
              ref={(el) => {
                imageRefs.current[i] = el;
              }}
              sx={{ position: 'absolute', inset: 0, zIndex: i + 1, pointerEvents: 'none' }}
            >
              <Image src={img} sx={{ objectFit: 'contain', width: 1, height: 1 }} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ElegantCards;
