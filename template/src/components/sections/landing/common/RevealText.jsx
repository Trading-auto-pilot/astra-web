import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function RevealText({
  children,
  animateOnScroll = true,
  delay = 0,
  duration = 0.8,
  stagger = 0.05,
  start = 'top 80%',
  ease = 'power4.out',
  reverse = false,
  sx,
  component = 'div',
  ...otherProps
}) {
  const containerRef = useRef(null);
  const elementRef = useRef([]);
  const splitRef = useRef([]);
  const lines = useRef([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      splitRef.current = [];
      elementRef.current = [];
      lines.current = [];

      let elements = [];

      if (containerRef.current.hasAttribute('data-copy-wrapper')) {
        elements = Array.from(containerRef.current.children);
      } else {
        elements = [containerRef.current];
      }

      elements.forEach((element) => {
        elementRef.current.push(element);

        const split = SplitText.create(element, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'line++',
        });

        splitRef.current.push(split);

        const computedStyle = window.getComputedStyle(element);
        const textIndent = computedStyle.textIndent;

        if (textIndent && textIndent !== '0px') {
          if (split.lines && split.lines.length > 0) {
            split.lines[0].style.paddingLeft = textIndent;
          }
          element.style.textIndent = '0';
        }

        if (split.lines) {
          lines.current.push(...split.lines);
        }
      });

      gsap.set(lines.current, { y: '100%' });

      const animationProps = {
        y: '0%',
        duration,
        stagger: reverse ? -stagger : stagger,
        ease,
        delay,
      };

      if (animateOnScroll) {
        gsap.to(lines.current, {
          ...animationProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start,
            once: true,
          },
        });
      } else {
        gsap.to(lines.current, animationProps);
      }

      return () => {
        splitRef.current.forEach((split) => {
          if (split) {
            split.revert();
          }
        });
      };
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay, duration, stagger, start, ease, reverse],
    },
  );

  if (React.Children.count(children) === 1 && component === 'div') {
    const child = React.Children.only(children);

    return React.cloneElement(child, {
      ref: containerRef,
      sx: sx ? { ...(child.props.sx || {}), ...sx } : child.props.sx,
      ...otherProps,
    });
  }

  const Component = component;

  return (
    <Component ref={containerRef} data-copy-wrapper="true" sx={sx} {...otherProps}>
      {children}
    </Component>
  );
}
