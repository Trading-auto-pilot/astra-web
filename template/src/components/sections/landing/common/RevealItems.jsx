import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function RevealItems({
  children,
  animateOnScroll = true,
  delay = 0,
  duration = 0.8,
  stagger = 0.05,
  start = 'top 80%',
  ease = 'power2.out',
  y = 30,
  opacity = true,
  sx,
  component = 'div',
  ...otherProps
}) {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (!containerRef.current?.children) return;

      const items = Array.from(containerRef.current.children);

      const initialProps = {};
      if (opacity) initialProps.opacity = 0;
      if (y !== 0) initialProps.y = y;

      gsap.set(items, initialProps);

      const animationProps = {
        duration,
        ease,
        stagger,
        delay,
      };
      if (opacity) animationProps.opacity = 1;
      if (y !== 0) animationProps.y = 0;

      if (animateOnScroll) {
        gsap.to(items, {
          ...animationProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start,
            once: true,
          },
        });
      } else {
        gsap.to(items, animationProps);
      }
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay, duration, stagger, start, ease, y, opacity],
    },
  );

  const Component = component;

  return (
    <Component ref={containerRef} sx={sx} {...otherProps}>
      {children}
    </Component>
  );
}
