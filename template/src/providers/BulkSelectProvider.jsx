import { createContext, use, useEffect, useState } from 'react';

export const BulkSelectContext = createContext({});

const BulkSelectProvider = ({ data, children }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  const isIndeterminate = selectedIds.length > 0 && !isAllSelected;

  const handleToggleAll = (checked) => {
    if (checked && !isIndeterminate) {
      setSelectedIds(data.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleCheck = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => data.findIndex((item) => item.id === id) > -1));
  }, [data]);

  return (
    <BulkSelectContext
      value={{
        selectedIds,
        isAllSelected,
        isIndeterminate,
        handleToggleAll,
        handleToggleCheck,
      }}
    >
      {children}
    </BulkSelectContext>
  );
};

export const useBulkSelect = () => use(BulkSelectContext);

export default BulkSelectProvider;
