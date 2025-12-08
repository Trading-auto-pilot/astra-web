// src/components/atoms/buttons/IconButton.tsx
import type { ReactNode } from "react";
import { BaseButton } from "./BaseButton";
import type { BaseButtonProps } from "./BaseButton";

export type IconButtonProps = Omit<BaseButtonProps, "children" | "shape"> & {
  icon: ReactNode;
  size?: "sm" | "md" | "lg";
};

export function IconButton({ icon, size = "md", ...rest }: IconButtonProps) {
  return (
    <BaseButton
      size={size}
      shape="circle"
      variant={rest.variant ?? "ghost"}
      {...rest}
    >
      {icon}
    </BaseButton>
  );
}

export default IconButton;
