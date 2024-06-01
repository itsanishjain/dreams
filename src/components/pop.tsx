"use client";

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
import { Button } from "./ui/button";
import Image from "next/image";
import { useContext } from "react";
import { AppContext, ContextProps } from "@/AppContext";

export function Pop() {
  const { canvasSize, setCanvasSize } = useContext(AppContext) as ContextProps;

  // console.log(canvasSize.width);
  return (
    <div className="mb-4">
      <Drawer>
        <DrawerTrigger>
          <span className="btn">Choose Size</span>
        </DrawerTrigger>
        <DrawerContent className="rounded-none">
          <DrawerHeader>
            <DrawerTitle>Choose a size</DrawerTitle>
            <DrawerDescription>You can change this anytime.</DrawerDescription>
          </DrawerHeader>

          <div className="gap-2 flex flex-col md:flex-row justify-around items-center">
            <Image
              className="bg-gray-400 rounded-md hover:cursor-pointer"
              src="/badge4x3rbg.png"
              alt="badge4x3"
              width={300}
              height={200}
              onClick={() => {
                setCanvasSize({ width: 384, height: 288 });
              }}
            />
            <Image
              className="bg-gray-400 rounded-md hover:cursor-pointer"
              src="/badge4x6rbg.png"
              alt="badge4x6"
              width={300}
              height={200}
              onClick={() => {
                setCanvasSize({ width: 384, height: 576 });
              }}
            />
          </div>

          <DrawerFooter>
            {/* <Button>Submit</Button> */}
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
