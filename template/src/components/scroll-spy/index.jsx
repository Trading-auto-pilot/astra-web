import { createContext, use, useCallback, useEffect, useRef, useState } from 'react';

export const ScrollSpyContext = createContext({});

const ScrollSpy = ({ children, offset: globalOffset }) => {
  const [activeElemId, setActiveElemId] = useState('');
  const sectionRefs = useRef({});
  const lastScrollTopRef = useRef(0);

  const isInView = ({ element, offset }) => {
    if (!element) {
      return false;
    }
    let topOffset = 0;
    let bottomOffset = 0;

    if (!offset) {
      offset = globalOffset;
    }

    if (offset) {
      if (typeof offset === 'number') {
        topOffset = offset;
        bottomOffset = offset;
      } else {
        topOffset = offset.top ?? 0;
        bottomOffset = offset.bottom ?? 0;
      }
    }

    const rect = element.getBoundingClientRect();

    return (
      (rect.top >= 0 && rect.top <= window.innerHeight - topOffset) ||
      (rect.bottom >= bottomOffset && rect.bottom <= window.innerHeight - topOffset)
    );
  };

  const spy = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    let toUp = false;
    if (scrollTop > lastScrollTopRef.current) {
      toUp = false;
    } else {
      toUp = true;
    }
    lastScrollTopRef.current = scrollTop <= 0 ? 0 : scrollTop;

    const items = [];
    Object.values(sectionRefs.current).forEach((item) => {
      if (item.element && isInView(item)) {
        items.push(item.element.id);
      }
    });

    if (!items.length) {
      return;
    }

    if (toUp) {
      setActiveElemId(items[0]);
    } else {
      setActiveElemId(items[items.length - 1]);
    }
  }, [globalOffset]);

  useEffect(() => {
    spy();
    window.addEventListener('scroll', spy);

    return () => {
      window.removeEventListener('scroll', spy);
    };
  }, [spy]);

  return (
    <ScrollSpyContext
      value={{
        activeElemId,
        setActiveElemId,
        sectionRefs,
      }}
    >
      {children}
    </ScrollSpyContext>
  );
};

export const useScrollSpyContext = () => use(ScrollSpyContext);

export default ScrollSpy;
