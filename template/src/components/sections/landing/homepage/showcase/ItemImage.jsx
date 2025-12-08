import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import Box from '@mui/material/Box';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'components/base/Image';

gsap.registerPlugin(ScrollTrigger);

const ShowcaseItemImg = ({ src, sx, parallaxSpeed = 0.3, parallaxDirection = 'up' }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(
    () => {
      if (!containerRef.current || !imageRef.current) return;
      const moveDistance = parallaxDirection === 'up' ? -70 * parallaxSpeed : 70 * parallaxSpeed;
      gsap.to(imageRef.current, {
        y: `${moveDistance}%`,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: containerRef, dependencies: [parallaxSpeed, parallaxDirection] },
  );

  return (
    <Box
      ref={containerRef}
      sx={{
        flex: '1 1 50%',
        overflow: 'hidden',
        bgcolor: 'background.default',
        position: 'relative',
        ...sx,
      }}
    >
      <Box
        ref={imageRef}
        sx={{
          height: '150%',
          width: '100%',
          position: 'relative',
        }}
      >
        <Image
          src={src}
          sx={{
            height: 1,
            width: 1,
            objectFit: 'cover',
            verticalAlign: 'middle',
            display: 'block',
          }}
        />
      </Box>
    </Box>
  );
};

export default ShowcaseItemImg;
