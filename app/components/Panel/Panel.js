import { useState, useEffect, useRef } from "react";
import Resizer from "./components/Resizer";
import "./styles.css";

const Panel = ({ children }) => {
  const panelRef = useRef(null);
  const [pointerDown, setPointerDown] = useState(false);

  useEffect(() => {
    const handlePointerUp = () => setPointerDown(false);

    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.addEventListener("pointerup", handlePointerUp);
    };
  }, []);

  useEffect(() => {
    const ratio = window.devicePixelRatio;

    const handlePointerMove = (e) =>
      handleDrag(e.movementX / ratio, e.movementY / ratio);

    if (pointerDown) {
      window.addEventListener("pointermove", handlePointerMove);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [pointerDown]);

  const handlePointerDown = (e) => {
    if (!e.target.id) setPointerDown(true);
  };

  const handleDrag = (movementX, movementY) => {
    const panel = panelRef.current;
    if (!panel) return;

    const { x, y } = panel.getBoundingClientRect();

    panel.style.left = `${x + movementX}px`;
    panel.style.top = `${y + movementY}px`;
  };

  const handleResize = (direction, movementX, movementY) => {
    const panel = panelRef.current;
    if (!panel) return;

    const { width, height, x, y } = panel.getBoundingClientRect();

    const resizeTop = () => {
      panel.style.height = `${height - movementY}px`;
      panel.style.top = `${y + movementY}px`;
    };

    const resizeRight = () => {
      panel.style.width = `${width + movementX}px`;
    };

    const resizeBottom = () => {
      panel.style.height = `${height + movementY}px`;
    };

    const resizeLeft = () => {
      panel.style.width = `${width - movementX}px`;
      panel.style.left = `${x + movementX}px`;
    };

    switch (direction) {
      case "topLeft":
        resizeTop();
        resizeLeft();
        break;

      case "top":
        resizeTop();
        break;

      case "topRight":
        resizeTop();
        resizeRight();
        break;

      case "right":
        resizeRight();
        break;

      case "bottomRight":
        resizeBottom();
        resizeRight();
        break;

      case "bottom":
        resizeBottom();
        break;

      case "bottomLeft":
        resizeBottom();
        resizeLeft();
        break;

      case "left":
        resizeLeft();
        break;

      default:
        break;
    }
  };

  return (
    <div className="panel" ref={panelRef}>
      <Resizer onResize={handleResize} />
      <div
        onPointerDown={handlePointerDown}
        onDrag={handleDrag}
        className="panel-container"
      >
        {children}
      </div>
    </div>
  );
};

export default Panel;
