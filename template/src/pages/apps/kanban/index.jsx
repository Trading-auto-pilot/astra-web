import KanbanProvider from 'providers/KanbanProvider';

const index = ({ children }) => {
  return <KanbanProvider>{children}</KanbanProvider>;
};

export default index;
