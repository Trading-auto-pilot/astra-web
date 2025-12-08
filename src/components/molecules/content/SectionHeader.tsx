import { isValidElement, type ReactNode } from "react";
import Subtitle from "../../atoms/typography/Subtitle";
import BodyText from "../../atoms/typography/BodyText";

export type SectionHeaderProps = {
  title: ReactNode;
  subTitle?: ReactNode;
  actionComponent?: ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  subTitle,
  actionComponent,
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`
        mb-6 flex flex-col gap-3 justify-between sm:flex-row sm:items-start
        ${className}
      `}
    >
      <div>
        <Subtitle className="mb-1 whitespace-nowrap">{title}</Subtitle>
        {typeof subTitle === "string" ? (
          <BodyText muted>{subTitle}</BodyText>
        ) : (
          isValidElement(subTitle) && subTitle
        )}
      </div>
      {actionComponent}
    </div>
  );
}

export default SectionHeader;
