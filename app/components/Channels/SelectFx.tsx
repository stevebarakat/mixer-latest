import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function SelectFx({ children }: Props) {
  return <div>{children}</div>;
}

export default SelectFx;
