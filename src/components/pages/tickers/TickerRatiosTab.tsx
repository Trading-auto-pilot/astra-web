import TickerStatementTab, { type TickerStatementTabProps } from "./TickerStatementTab";

export type TickerRatiosTabProps = TickerStatementTabProps;

export function TickerRatiosTab(props: TickerRatiosTabProps) {
  return <TickerStatementTab {...props} />;
}

export default TickerRatiosTab;
