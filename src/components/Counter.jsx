"use client";
import { Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";

export const Counter = ({ label, value, onChange, min = 0, max = 10 }) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center space-x-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={`h-8 w-8 rounded-full ${
            value <= min ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleDecrement}
          disabled={value <= min}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center font-medium">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={`h-8 w-8 rounded-full ${
            value >= max ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleIncrement}
          disabled={value >= max}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};