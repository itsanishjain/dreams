import React, { useState, useEffect } from "react";
import { fabric } from "fabric";

interface Props {
  canvas: fabric.Canvas | null;
}

const SelectedObjectProperties: React.FC<Props> = ({ canvas }) => {
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (e: any) => {
        setSelectedObject(e.target);
      });
      canvas.on("selection:updated", (e: any) => {
        setSelectedObject(e.target);
      });
      canvas.on("selection:cleared", () => {
        setSelectedObject(null);
      });
    }
  }, [canvas]);

  if (!selectedObject) {
    return <div>No object selected</div>;
  }

  return (
    <div>
      <h2>Selected Object Properties</h2>
      <p>Type: {selectedObject.type}</p>
      {selectedObject.type === "text" && (
        <div>
          <p>Text: {(selectedObject as fabric.IText).text}</p>
          <p>Font Size: {(selectedObject as fabric.IText).fontSize}</p>
          <p>Font Family: {(selectedObject as fabric.IText).fontFamily}</p>
        </div>
      )}
      <p>Left: {selectedObject.left}</p>
      <p>Top: {selectedObject.top}</p>
      <p>Width: {selectedObject.width}</p>
      <p>Height: {selectedObject.height}</p>
      <pre>{JSON.stringify(canvas, null, 2)}</pre>
    </div>
  );
};

export default SelectedObjectProperties;
