import { useScrollSpyContext } from '.';

const ScrollSpyNavItem = ({ children }) => {
  const { activeElemId } = useScrollSpyContext();

  if (typeof children === 'function') {
    return children({ activeElemId });
  }

  return children;
};

export default ScrollSpyNavItem;
