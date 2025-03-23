"use client";
import { steps } from "@/app/data";
import React from "react";

const StepOne = () => {

  return (
    <section>
      <div className="container mx-auto flex flex-col gap-6">
        <h1 className="md:text-3xl text-2xl font-medium">
          It's easy to get started with TakeOffYachts
        </h1>
        <ol className="flex flex-col gap-6">
          {steps.map(({ number, title, description }) => (
            <li key={number} className="flex space-x-4 flex-col">
              <span className="font-semibold">
                {number}. {title}
              </span>
              <p className="text-sm text-gray-500">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default StepOne;
