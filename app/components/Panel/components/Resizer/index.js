import { useState, useEffect } from "react";
import "./resizer.css";

const Resizer = ({ onResize }) => {
  const [direction, setDirection] = useState("");
  const [pointerDown, setPointerDown] = useState(false);

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!direction) return;

      const ratio = window.devicePixelRatio;

      onResize(direction, e.movementX / ratio, e.movementY / ratio);
    };

    if (pointerDown) {
      window.addEventListener("pointermove", handlePointerMove);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [pointerDown, direction, onResize]);

  useEffect(() => {
    const handlePointerUp = () => setPointerDown(false);

    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const handlePointerDown = (direction) => () => {
    setDirection(direction);
    setPointerDown(true);
  };

  return (
    <>
      <div
        className="top-left"
        onPointerDown={handlePointerDown("topLeft")}
      ></div>
      <div className="top" onPointerDown={handlePointerDown("top")}></div>
      <div
        className="top-right"
        onPointerDown={handlePointerDown("topRight")}
      ></div>
      <div className="right" onPointerDown={handlePointerDown("right")}></div>
      <div
        className="right-bottom"
        onPointerDown={handlePointerDown("bottomRight")}
      ></div>
      <div className="bottom" onPointerDown={handlePointerDown("bottom")}></div>
      <div
        className="bottom-left"
        onPointerDown={handlePointerDown("bottomLeft")}
      ></div>
      <div className="left" onPointerDown={handlePointerDown("left")}></div>
    </>
  );
};

export default Resizer;
