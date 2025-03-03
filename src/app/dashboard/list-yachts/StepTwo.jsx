"use client";
import { Button } from "@/components/ui/button";
import { Image, Plus } from "lucide-react";
import React, { useRef } from "react";

const StepTwo = () => {
  const addPhotosRef = useRef(null);
  const takePhotosRef = useRef(null);
  const handleAddPhotosClick = () => {
    if (addPhotosRef.current) {
      addPhotosRef.current.click();
    }
  };
  const handleTakePhotosClick = () => {
    if (takePhotosRef.current) {
      takePhotosRef.current.click();
    }
  };
  const handleAddPhotos = (event) => {
    const files = event.target.files;
  };
  const handleTakePhotos = (event) => {
    const files = event.target.files;
  };
  return (
    <div>
      <h2 className="md:text-2xl text-lg font-semibold">Add some photos of your yacht</h2>
      <p className="text-sm text-gray-500">
        Cog jack across red yellow grog splice gabion. Six aye gar spyglass
        o'nine rig gunwalls jennys sail
      </p>
      <div className="flex md:flex-row flex-col justify-center items-center md:gap-4 gap-2 w-full mt-8">
        <Button
          variant="outline"
          className="flex items-center rounded-full justify-center w-full border-2 border-gray-700 h-10"
          onClick={handleAddPhotosClick}
        >
          Add Photos
          <Plus className="w-4 h-4 text-black" />
        </Button>
        <Button
          variant="outline"
          className="flex items-center rounded-full justify-center w-full border-2 border-gray-700 h-10"
          onClick={handleTakePhotosClick}
        >
          Take Photos
          <Image className="w-4 h-4 text-black" />
        </Button>
        <input
          type="file"
          ref={addPhotosRef}
          style={{ display: "none" }}
          onChange={handleAddPhotos}
          multiple
          accept="image/"
        />
        <input
          type="file"
          ref={takePhotosRef}
          style={{ display: "none" }}
          onChange={handleTakePhotos}
          accept="image/"
          capture="environment"
        />
      </div>
    </div>
  );
};
export default StepTwo;
