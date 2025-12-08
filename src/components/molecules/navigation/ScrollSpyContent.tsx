import { type ReactNode } from "react";
import { useScrollSpyContext } from "./ScrollSpy";

export type ScrollSpyContentProps = {
  id: string;
  children: ReactNode;
  offset?: number | { top?: number; bottom?: number };
  className?: string;
};

export function ScrollSpyContent({ id, children, offset, className = "" }: ScrollSpyContentProps) {
  const { sectionRefs } = useScrollSpyContext();

  return (
    <div
      id={id}
      ref={(el) => {
        sectionRefs.current[id] = { element: el, offset };
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export default ScrollSpyContent;
