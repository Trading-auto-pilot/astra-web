import AppIcon from "../../atoms/icon/AppIcon";
import BaseButton from "../../atoms/base/buttons/BaseButton";

export type PaginationActionProps = {
  page: number;
  rowsPerPage: number;
  count: number;
  onPageChange: (nextPage: number) => void;
  onShowAllClick?: () => void;
  showAllHref?: string;
  showFullPagination?: boolean;
};

export function CustomTablePaginationAction({
  page,
  rowsPerPage,
  count,
  onPageChange,
  onShowAllClick,
  showAllHref,
  showFullPagination = false,
}: PaginationActionProps) {
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));
  const isFirst = page <= 0;
  const isLast = page >= totalPages - 1;
  const isShowingAll = rowsPerPage === count;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <a
        className="text-xs font-semibold text-blue-600 hover:underline"
        href={showAllHref}
        onClick={(e) => {
          if (onShowAllClick) {
            e.preventDefault();
            onShowAllClick();
          }
        }}
      >
        {isShowingAll ? "View less" : "Show all"}
      </a>

      {showFullPagination ? (
        <div className="flex items-center gap-2">
          <BaseButton
            variant="ghost"
            size="sm"
            disabled={isFirst}
            onClick={() => onPageChange(0)}
          >
            <AppIcon icon="mdi:page-first" />
          </BaseButton>
          <BaseButton
            variant="ghost"
            size="sm"
            disabled={isFirst}
            onClick={() => onPageChange(page - 1)}
          >
            <AppIcon icon="material-symbols:chevron-left-rounded" />
          </BaseButton>
          <span className="text-xs text-slate-600">
            Page {page + 1} / {totalPages}
          </span>
          <BaseButton
            variant="ghost"
            size="sm"
            disabled={isLast}
            onClick={() => onPageChange(page + 1)}
          >
            <AppIcon icon="material-symbols:chevron-right-rounded" />
          </BaseButton>
          <BaseButton
            variant="ghost"
            size="sm"
            disabled={isLast}
            onClick={() => onPageChange(totalPages - 1)}
          >
            <AppIcon icon="mdi:page-last" />
          </BaseButton>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <BaseButton
            variant="ghost"
            size="sm"
            disabled={isFirst}
            onClick={() => onPageChange(page - 1)}
            startIcon={<AppIcon icon="material-symbols:chevron-left-rounded" />}
            className="hidden sm:inline-flex"
          >
            Previous
          </BaseButton>
          <BaseButton
            variant="ghost"
            size="sm"
            disabled={isFirst}
            onClick={() => onPageChange(page - 1)}
            className="sm:hidden"
          >
            <AppIcon icon="material-symbols:chevron-left-rounded" />
          </BaseButton>
          <BaseButton
            variant="ghost"
            size="sm"
            disabled={isLast}
            onClick={() => onPageChange(page + 1)}
            endIcon={<AppIcon icon="material-symbols:chevron-right-rounded" />}
            className="hidden sm:inline-flex"
          >
            Next
          </BaseButton>
          <BaseButton
            variant="ghost"
            size="sm"
            disabled={isLast}
            onClick={() => onPageChange(page + 1)}
            className="sm:hidden"
          >
            <AppIcon icon="material-symbols:chevron-right-rounded" />
          </BaseButton>
        </div>
      )}
    </div>
  );
}

export default CustomTablePaginationAction;
