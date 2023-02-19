import { useState, useEffect, useCallback } from "react";

const useDrag = (ref: any, options: any) => {
  const {
    onPointerDown = () => {},
    onPointerUp = () => {},
    onPointerMove = () => {},
    onPointerLeave = () => {},
    onDrag = () => {},
  } = options;

  const [isDragging, setIsDragging] = useState(false);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLInputElement>): void => {
      setIsDragging(false);
      onPointerUp(e);
    },
    [onPointerUp]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      setIsDragging(target.tagName !== "INPUT");
      onPointerDown(e);
    },
    [onPointerDown]
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLInputElement>): void => {
      onPointerLeave(e);
      setIsDragging(false);
    },
    [onPointerLeave]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLInputElement>): void => {
      onPointerMove(e);
      if (isDragging) {
        onDrag(e);
      }
    },
    [isDragging, onDrag, onPointerMove]
  );

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener("pointerdown", handlePointerDown);
      element.addEventListener("pointerup", handlePointerUp);
      element.addEventListener("pointermove", handlePointerMove);
      element.addEventListener("pointerleave", handlePointerLeave);

      return () => {
        element.removeEventListener("pointerdown", handlePointerDown);
        element.removeEventListener("pointerup", handlePointerUp);
        element.removeEventListener("pointermove", handlePointerMove);
        element.removeEventListener("pointerleave", handlePointerLeave);
      };
    }
  }, [
    ref,
    handlePointerMove,
    handlePointerUp,
    handlePointerDown,
    handlePointerLeave,
  ]);
};

export default useDrag;
