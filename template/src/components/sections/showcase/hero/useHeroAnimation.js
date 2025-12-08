import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBreakpoints } from 'providers/BreakpointsProvider';

gsap.registerPlugin(ScrollTrigger);

export const useHeroAnimation = (refs) => {
  const { up } = useBreakpoints();

  const upSm = up('sm');

  useGSAP(
    () => {
      if (!refs.section.current) return;

      const timeline = gsap.timeline();

      timeline
        .from(refs.media.current, {
          y: -150,
          opacity: 0,
          scale: 1.1,
          duration: 1.2,
          ease: 'power3.out',
        })
        .from(
          refs.text.current,
          {
            y: 50,
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.6',
        )
        .from(
          refs.techStack.current,
          {
            y: 30,
            opacity: 0,
            scale: 0.9,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.5',
        )
        .from(
          refs.buttons.current,
          {
            y: 30,
            opacity: 0,
            scale: 0.9,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.5',
        )
        .add(() => {
          const config = {
            trigger: refs.section.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          };

          const [mediaY, textY, techStackY, buttonsY] = [
            upSm ? -600 : -350,
            upSm ? -300 : -300,
            upSm ? -200 : -200,
            upSm ? -150 : -120,
          ];

          [
            [refs.media.current, mediaY, 'power2.inOut'],
            [refs.text.current, textY, 'power1.inOut'],
            [refs.techStack.current, techStackY, 'power1.inOut'],
            [refs.buttons.current, buttonsY, 'power1.inOut'],
          ].forEach(([element, y, ease]) => {
            gsap.to(element, {
              y,
              ease,
              scrollTrigger: config,
              immediateRender: false,
            });
          });

          ScrollTrigger.refresh();
        });
    },
    { scope: refs.section, dependencies: [upSm] },
  );
};
