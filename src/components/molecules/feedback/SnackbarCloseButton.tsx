import AppIcon from "../../atoms/icon/AppIcon";

export type SnackbarCloseButtonProps = {
  onClose: () => void;
};

export function SnackbarCloseButton({ onClose }: SnackbarCloseButtonProps) {
  return (
    <button
      type="button"
      className="notistack-close-btn inline-flex items-center justify-center rounded-full p-1 text-slate-500 hover:bg-slate-100"
      onClick={onClose}
    >
      <AppIcon icon="material-symbols:close-rounded" fontSize={20} />
    </button>
  );
}

export default SnackbarCloseButton;
