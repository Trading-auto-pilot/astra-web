import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Offset = number | { top?: number; bottom?: number };

type ScrollSpyContextValue = {
  activeElemId: string;
  sectionRefs: React.MutableRefObject<Record<string, { element: HTMLElement | null; offset?: Offset }>>;
};

const ScrollSpyContext = createContext<ScrollSpyContextValue | undefined>(undefined);

export type ScrollSpyProps = {
  children: ReactNode;
  offset?: Offset;
};

export function ScrollSpy({ children, offset: globalOffset }: ScrollSpyProps) {
  const [activeElemId, setActiveElemId] = useState("");
  const sectionRefs = useRef<Record<string, { element: HTMLElement | null; offset?: Offset }>>({});
  const lastScrollTopRef = useRef(0);

  const isInView = ({ element, offset }: { element: HTMLElement | null; offset?: Offset }) => {
    if (!element) return false;
    let topOffset = 0;
    let bottomOffset = 0;

    const resolvedOffset = offset ?? globalOffset;
    if (resolvedOffset) {
      if (typeof resolvedOffset === "number") {
        topOffset = resolvedOffset;
        bottomOffset = resolvedOffset;
      } else {
        topOffset = resolvedOffset.top ?? 0;
        bottomOffset = resolvedOffset.bottom ?? 0;
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
    const scrollingUp = scrollTop <= lastScrollTopRef.current;
    lastScrollTopRef.current = scrollTop <= 0 ? 0 : scrollTop;

    const items: string[] = [];
    Object.values(sectionRefs.current).forEach((item) => {
      if (item.element && isInView(item)) {
        items.push(item.element.id);
      }
    });

    if (!items.length) return;
    setActiveElemId(scrollingUp ? items[0] : items[items.length - 1]);
  }, [globalOffset]);

  useEffect(() => {
    spy();
    window.addEventListener("scroll", spy);
    return () => window.removeEventListener("scroll", spy);
  }, [spy]);

  return (
    <ScrollSpyContext.Provider
      value={{
        activeElemId,
        sectionRefs,
      }}
    >
      {children}
    </ScrollSpyContext.Provider>
  );
}

export function useScrollSpyContext() {
  const ctx = useContext(ScrollSpyContext);
  if (!ctx) throw new Error("useScrollSpyContext must be used within <ScrollSpy>");
  return ctx;
}

export default ScrollSpy;
