"use client";
import Image from "next/image";
import { useContext } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { AppContext, ContextProps } from "@/AppContext";

export default function TemplatePop({ templates }: { templates: any }) {
  const { canvas } = useContext(AppContext) as ContextProps;

  return (
    <div className="mb-4">
      <Drawer>
        <DrawerTrigger>
          <span className="btn">Choose Template</span>
        </DrawerTrigger>
        <DrawerContent className="rounded-none p-2">
          <DrawerHeader>
            <DrawerTitle>Choose a template</DrawerTitle>
            <DrawerDescription>You can change this anytime.</DrawerDescription>
          </DrawerHeader>

          <div className="gap-4 grid md:grid-cols-4 ">
            <Image
              className="bg-gray-400 rounded-md hover:cursor-pointer"
              src="/canvas1.png"
              alt="canvas1"
              width={300}
              height={200}
              onClick={() => {
                if (canvas) {
                  canvas.loadFromJSON(
                    JSON.parse(templates[1].metadataText as string),
                    () => canvas.renderAll()
                  );
                }
              }}
            />
            <Image
              className="bg-gray-400 rounded-md hover:cursor-pointer"
              src="/canvas2.png"
              alt="canvas2"
              width={300}
              height={200}
              onClick={() => {
                if (canvas) {
                  canvas.loadFromJSON(
                    JSON.parse(templates[0].metadataText as string),
                    () => canvas.renderAll()
                  );
                }
              }}
            />
            <Image
              className="bg-gray-100 rounded-3xl hover:cursor-pointer"
              src="/blank.png" // Use an image that represents a blank canvas
              alt="blank canvas"
              width={300}
              height={200}
              onClick={() => {
                if (canvas) {
                  canvas.clear(); // Clear the canvas
                  canvas.setBackgroundColor("#ffffff", () => {
                    canvas.renderAll();
                  });
                }
              }}
            />
          </div>

          <DrawerFooter>
            <DrawerClose>
              <div className="btn">Cancel</div>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
