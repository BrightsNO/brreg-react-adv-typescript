import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  tone?: "info" | "error";
};

export function Message({ children, tone = "info" }: Props) {
  return <p className={`message message-${tone}`}>{children}</p>;
}
