"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { stepTabs } from "@/app/data";

const StepThree = () => {
  const [selectedTabs, setSelectedTabs] = useState({
    wifi: false,
    tv: false,
    kitchen: false,
    washer: false,
  });

  const toggleTab = (tab) => {
    setSelectedTabs((prev) => ({
      ...prev,
      [tab]: !prev[tab],
    }));
  };

  return (
    <section className="flex flex-col items-center">
      <div className="w-full text-start">
        <h2 className="md:text-2xl text-lg font-semibold">What your yacht has to offer?</h2>
        <p className="text-sm text-gray-500 mt-2">
          Cog jack across red yellow grog splice gabion. Six aye gar spyglass
        o'nine rig gunwalls jennys sail
      </p>
      </div>
      <div className="mt-6 w-full max-w-4xl">
        <div className="grid grid-cols-2 gap-4">
          {stepTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={selectedTabs[tab.id] ? "solid" : "outline"}
              color={selectedTabs[tab.id] ? "black" : "gray"}
              onClick={() => toggleTab(tab.id)}
              aria-pressed={selectedTabs[tab.id]}
              className={`w-full flex flex-col items-center h-24 justify-center space-x-2 px-4 py-2 border rounded transition-colors duration-200 ${
                selectedTabs[tab.id]
                  ? "border-2 border-gray-700 text-black font-semibold"
                  : "bg-white text-black hover:bg-gray-100 font-medium"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepThree;
