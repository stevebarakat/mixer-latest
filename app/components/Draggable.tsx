import { useRef, useState } from "react";
import useDrag from "~/hooks/useDrag";

type Props = {
  className: string;
  children: React.ReactNode;
};

function Draggable({ className = "default", children }: Props) {
  const draggableRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const handleDrag = (e: React.PointerEvent<HTMLInputElement>): void => {
    setTranslate(({ x, y }) => {
      return {
        x: x + e.movementX,
        y: y + e.movementY,
      };
    });
  };

  useDrag(draggableRef, {
    onDrag: handleDrag,
  });

  return (
    <div
      className={className}
      ref={draggableRef}
      style={{
        transform: `translate3d(${translate.x}px,${translate.y}px, 0)`,
      }}
    >
      {children}
    </div>
  );
}

export default Draggable;
