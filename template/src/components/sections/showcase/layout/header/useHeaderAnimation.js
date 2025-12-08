import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

export const useHeaderAnimation = (headerRef, logoRef, navItemsRef) => {
  useGSAP(
    () => {
      gsap.set([headerRef.current, logoRef.current, navItemsRef.current], { y: -100, opacity: 0 });
      gsap.set(logoRef.current, { y: -30 });
      gsap.set(navItemsRef.current, { y: -20 });

      gsap
        .timeline({ delay: 0.2 })
        .to(headerRef.current, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' })
        .to(logoRef.current, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .to(
          navItemsRef.current,
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
          '-=0.3',
        );
    },
    { scope: headerRef },
  );
};
