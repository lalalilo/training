import { useEffect, useRef } from "react";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

export const useDatGUI = (
  parent: React.MutableRefObject<HTMLDivElement | null>,
) => {
  const gui = useRef<GUI>();

  useEffect(() => {
    if (!parent.current) return;

    gui.current = new GUI({ autoPlace: false });
    parent.current.appendChild(gui.current.domElement);
    gui.current.close();

    return () => {
      if (gui.current) {
        gui.current.destroy();
      }
    };
  }, []);

  return gui;
};
