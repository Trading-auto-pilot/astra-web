export type TableLabelDisplayedRowsProps = {
  from: number;
  to: number;
  count: number;
};

export function TableLabelDisplayedRows({ from, to, count }: TableLabelDisplayedRowsProps) {
  return (
    <p className="text-xs text-slate-500">
      <span className="hidden sm:inline">Showing </span>
      <span className="font-semibold text-slate-800">
        {from}-{to} out of {count}
      </span>
      <span className="hidden sm:inline"> items</span>
    </p>
  );
}

export default TableLabelDisplayedRows;
