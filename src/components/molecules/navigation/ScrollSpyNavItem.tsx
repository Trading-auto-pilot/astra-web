import type { ReactNode } from "react";
import { useScrollSpyContext } from "./ScrollSpy";

export type ScrollSpyNavItemProps = {
  children: ReactNode | ((ctx: { activeElemId: string }) => ReactNode);
};

export function ScrollSpyNavItem({ children }: ScrollSpyNavItemProps) {
  const { activeElemId } = useScrollSpyContext();

  if (typeof children === "function") {
    return <>{children({ activeElemId })}</>;
  }

  return <>{children}</>;
}

export default ScrollSpyNavItem;
