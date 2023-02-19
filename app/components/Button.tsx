import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  id?: string;
  name?: string;
  title?: string;
  disabled?: boolean;
  className?: string;
  onClick?:
    | ((e: React.FormEvent<HTMLButtonElement>) => void)
    | ((e: React.MouseEvent<HTMLButtonElement>) => void);
};

function Button({ children, className = "button", ...props }: Props) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

export default Button;
