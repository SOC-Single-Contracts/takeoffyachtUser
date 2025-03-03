// import React from 'react'
// import { Button } from './button';

// const TimePicker = ({ selectedTime, onTimeSelect }) => {
//     const times = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    
//     return (
//       <div className="grid grid-cols-3 gap-2 p-4">
//         {times.map((time) => (
//           <Button
//             key={time}
//             variant={selectedTime.getHours() === parseInt(time) ? "primary" : "outline"}
//             onClick={() => {
//               const [hour] = time.split(':')
//               const newTime = new Date(selectedTime)
//               newTime.setHours(parseInt(hour), 0, 0, 0)
//               onTimeSelect(newTime)
//             }}
//             className="w-full"
//           >
//             {time}
//           </Button>
//         ))}
//       </div>
//     )
//   }

// export default TimePicker
"use client";
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

const TimePicker = ({ value, onChange }) => {
  // Ensure we have a valid Date object
  const currentTime = value instanceof Date ? value : new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  // Generate hours (9 AM to 9 PM)
  const hours = Array.from({ length: 13 }, (_, i) => i + 9);
  
  // Generate minutes (0, 15, 30, 45)
  const minutes = [0, 15, 30, 45];

  const handleTimeChange = (type, newValue) => {
    const newTime = new Date(currentTime);
    if (type === 'hour') {
      newTime.setHours(parseInt(newValue));
    } else {
      newTime.setMinutes(parseInt(newValue));
    }
    onChange?.(newTime);
  };

  return (
    <div className="flex gap-2">
      <Select
        value={currentHour.toString()}
        onValueChange={(value) => handleTimeChange('hour', value)}
      >
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent>
          {hours.map((hour) => (
            <SelectItem key={hour} value={hour.toString()}>
              {hour.toString().padStart(2, '0')}:00
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentMinute.toString()}
        onValueChange={(value) => handleTimeChange('minute', value)}
      >
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="Minute" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((minute) => (
            <SelectItem key={minute} value={minute.toString()}>
              :{minute.toString().padStart(2, '0')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimePicker;