import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { Box } from '@mui/material';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText, ScrollTrigger);

const RevealText = ({ children, animateOnScroll = true, delay = 0, start = 'top 75%' }) => {
  const containerRef = useRef(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    document?.fonts.ready.then(() => setFontsLoaded(true));
  }, []);

  useGSAP(
    () => {
      if (!fontsLoaded) return;

      const element = containerRef.current?.querySelector('*');
      if (!element) return;

      const split = new SplitText(element, { type: 'words' });
      const hasGradient = getComputedStyle(element).backgroundClip === 'text';

      if (hasGradient) {
        const { background, webkitTextFillColor } = getComputedStyle(element);
        const lines = groupWordsByLine(split.words);
        lines.forEach((words) => applyGradientToLine(words, background, webkitTextFillColor));
      }

      split.words.forEach((word) => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top';
        word.parentNode?.insertBefore(wrapper, word);
        wrapper.appendChild(word);
        word.style.display = 'inline-block';
      });

      gsap.fromTo(
        split.words,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power4.out',
          delay,
          ...(animateOnScroll && {
            scrollTrigger: { trigger: containerRef.current, start, once: true },
          }),
        },
      );

      return () => split.revert();
    },
    { scope: containerRef, dependencies: [animateOnScroll, delay, start, fontsLoaded] },
  );

  return <Box ref={containerRef}>{children}</Box>;
};

const groupWordsByLine = (words) => {
  const lines = [];
  let currentLine = [];
  let currentTop = words[0]?.offsetTop;

  words.forEach((word) => {
    if (word.offsetTop !== currentTop) {
      if (currentLine.length) lines.push(currentLine);
      currentLine = [word];
      currentTop = word.offsetTop;
    } else {
      currentLine.push(word);
    }
  });

  if (currentLine.length) lines.push(currentLine);

  return lines;
};

const applyGradientToLine = (words, background, webkitTextFillColor) => {
  const [first, last] = [words[0], words[words.length - 1]];
  const lineWidth = last.offsetLeft + last.offsetWidth - first.offsetLeft;
  const lineStart = first.offsetLeft;

  words.forEach((word) => {
    const wordOffset = word.offsetLeft - lineStart;
    Object.assign(word.style, {
      background,
      backgroundSize: `${lineWidth}px 100%`,
      backgroundPosition: `-${wordOffset}px 0`,
      webkitBackgroundClip: 'text',
      webkitTextFillColor,
    });
  });
};

export default RevealText;
