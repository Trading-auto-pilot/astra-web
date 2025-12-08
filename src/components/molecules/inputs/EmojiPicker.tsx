import { useRef, useState } from "react";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import AppIcon from "../../atoms/icon/AppIcon";

export type EmojiPickerProps = {
  handleEmojiSelect?: (emoji: string) => void;
  /** Elemento custom per il trigger (es. icona nella chat) */
  actionButtonEle?: React.ReactNode;
  className?: string;
};

export default function EmojiPicker({
  handleEmojiSelect,
  actionButtonEle,
  className = "",
}: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const emojis = [
    "😀",
    "😁",
    "😂",
    "🤣",
    "😊",
    "😍",
    "😘",
    "😎",
    "🤩",
    "🤔",
    "😴",
    "😢",
    "😡",
    "👍",
    "👏",
    "🙏",
    "🎉",
    "🔥",
    "✨",
    "💡",
    "✅",
    "❌",
  ];

  const onEmojiSelect = (emoji: string) => {
    if (handleEmojiSelect) {
      handleEmojiSelect(emoji);
    }
    setOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={anchorRef}>
      <div
        onClick={() => setOpen((v) => !v)}
        className="inline-flex cursor-pointer"
      >
        {actionButtonEle ? (
          actionButtonEle
        ) : (
          <BaseButton
            variant="solid"
            size="sm"
            shape="square"
            className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          >
            <AppIcon icon="material-symbols:mood-outline-rounded" fontSize={20} />
          </BaseButton>
        )}
      </div>

      {open && (
        <div
          className="
            absolute z-50 mt-2
            rounded-md border border-zinc-200 bg-white shadow-lg p-2
          "
        >
          <div className="grid grid-cols-6 gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="h-9 w-9 rounded-md text-lg hover:bg-slate-100"
                onClick={() => onEmojiSelect(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
