import { createContext, useState } from "react";
import { fabric } from "fabric";
interface CanvasSize {
  width: number;
  height: number;
}

export interface ContextProps {
  canvas: fabric.Canvas | undefined;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | undefined>>;
  canvasSize: CanvasSize;
  setCanvasSize: React.Dispatch<React.SetStateAction<CanvasSize>>;
  canvasTemplate: string;
  setCanvasTemplate: React.Dispatch<React.SetStateAction<string>>;
}

export const AppContext = createContext<ContextProps | null>(null);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({
    width: 384,
    height: 288,
  });

  const [canvasTemplate, setCanvasTemplate] = useState<string>("");

  const [canvas, setCanvas] = useState<fabric.Canvas | undefined>(undefined);

  return (
    <AppContext.Provider
      value={{
        canvasSize,
        setCanvasSize,
        canvasTemplate,
        setCanvasTemplate,
        canvas,
        setCanvas,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
