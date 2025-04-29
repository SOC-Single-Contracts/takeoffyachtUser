import { format, setHours, setMinutes, isAfter, isBefore, parse, addHours } from 'date-fns';


export const calculateDaysBetween = (fromDate, toDate) => {
  if (!fromDate || !toDate) return 1; // Default to 1 if input is missing

  const start = new Date(fromDate);
  const end = new Date(toDate);

  if (isNaN(start) || isNaN(end)) return 1; // Ensure valid dates

  const timeDifference = end - start;
  let daysDifference = timeDifference / (1000 * 60 * 60 * 24); // Convert ms to days

  daysDifference = Math.max(0, Math.floor(daysDifference)); // Ensure non-negative days

  return daysDifference === 0 ? 1 : daysDifference; // Return 1 if difference is 0
};


export const formatDate = (isoDate) => {
  if (!isoDate) return ""; // Handle empty or undefined input

  const date = new Date(isoDate);

  // Extract year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two-digit day

  return `${day}-${month}-${year}`

}


export const f1yachtsTotal = (price, date, endDate, extras) => {
  const startDate = new Date(date);
  const finalEndDate = new Date(endDate || date);
  const days = Math.ceil((finalEndDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const baseTotal = (price || 0) * days;

  const extrasTotal = (extras || []).reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return baseTotal + extrasTotal;
};


export function removeLeadingZeros(value) {
  if (typeof value !== "string") return value; // Make sure it's a string
  const newValue = value.replace(/^0+/, '');
  return newValue === "" ? "0" : newValue;
}

export function isDateDisabled(date, availableDates, dateRange) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const dateYear = date.getFullYear();
  // console.log(dateYear,currentYear)
  const formattedDate = format(date, 'yyyy-MM-dd');

  //  Force allow 30 and 31 December 2025
  // if (formattedDate === '2025-12-30' || formattedDate === '2025-12-31') {
  //   return false; // ✅ Not disabled
  // }

  // return (
  //   date < new Date(today.setHours(0, 0, 0, 0)) || // Past dates
  //   (dateRange?.start_date && date < new Date(dateRange.start_date)) ||
  //   (dateRange?.end_date && date > new Date(dateRange.end_date)) ||
  //   !availableDates.includes(format(date, 'yyyy-MM-dd'))
  // );
  return (
    date < new Date(today.setHours(0, 0, 0, 0)) // Past dates
  );
}






export const showSelectedYachtPrice = (selectedYacht, yachtsType, bookingData,newYearCanApply) => {
  let price = 0;

  if (!selectedYacht?.yacht) return 0;

  const perHourPrice = selectedYacht?.yacht?.per_hour_price || 0;
  const perDayPrice = selectedYacht?.yacht?.per_day_price || 0;
  const newYearperDayPrice = selectedYacht?.yacht?.new_year_per_day_price || 0;
  const newYearperHourPrice = selectedYacht?.yacht?.new_year_per_hour_price || 0;

  const nyStartTime = selectedYacht?.yacht?.ny_start_time; // like "18:00:00"
  const nyEndTime = selectedYacht?.yacht?.ny_end_time;     // like "22:00:00"

  const bookingDate = bookingData?.date ? new Date(bookingData.date) : null;

  if (yachtsType === "yachts") {
    if (bookingData?.bookingType === "hourly") {
      const isNewYearsEve = newYearCanApply;
      if (isNewYearsEve) {
        let isWithinNewYearEveTime = false;
        // console.log(bookingData?.startTime, bookingData?.endTime, nyStartTime, nyEndTime)
        if (isNewYearsEve && bookingData?.startTime && bookingData?.endTime && nyStartTime && nyEndTime) {
          // console.log("comming")
          const userStartTime = new Date(bookingData.startTime);
          const userEndTime = new Date(bookingData.endTime);

          // Parse ny_start_time and ny_end_time into Dates based on bookingDate
          const yachtNewYearStart = new Date(bookingDate);
          const yachtNewYearEnd = new Date(bookingDate);

          const [startHours, startMinutes, startSeconds] = nyStartTime.split(':').map(Number);
          yachtNewYearStart.setHours(startHours, startMinutes, startSeconds || 0);

          const [endHours, endMinutes, endSeconds] = nyEndTime.split(':').map(Number);
          yachtNewYearEnd.setHours(endHours, endMinutes, endSeconds || 0);

          // console.log("User Start:", userStartTime, "Yacht NY Start:", yachtNewYearStart);
          // console.log(  "User End:", userEndTime,"Yacht NY End:", yachtNewYearEnd);

          isWithinNewYearEveTime =
            userStartTime >= yachtNewYearStart && userEndTime <= yachtNewYearEnd;
        }

        // console.log("isNewYearsEve:", isNewYearsEve, "isWithinNewYearEveTime:", isWithinNewYearEveTime);

        if (isNewYearsEve && isWithinNewYearEveTime) {
          price = newYearperHourPrice;
        } else {
          price = perHourPrice;
        }

      } else {
        price = perHourPrice;
      }


    } else if (bookingData?.bookingType === "date_range") {
      price = perHourPrice;
    }
  } else if (yachtsType === "f1yachts") {
    price = perDayPrice;
  }

  return price;
};

export const checkNewYearApplied = (selectedYacht, yachtsType, bookingData,newYearCanApply) => {
  let check = false;

  if (!selectedYacht?.yacht) return false;

  const nyStartTime = selectedYacht?.yacht?.ny_start_time; // like "18:00:00"
  const nyEndTime = selectedYacht?.yacht?.ny_end_time;     // like "22:00:00"

  const bookingDate = bookingData?.date ? new Date(bookingData.date) : null;
 
  const isNewYearsEve = newYearCanApply;

  let isWithinNewYearEveTime = true;
  // console.log(bookingData?.startTime, bookingData?.endTime, nyStartTime, nyEndTime)
  // if (isNewYearsEve && bookingData?.startTime && bookingData?.endTime && nyStartTime && nyEndTime) {
  //   // console.log("comming")
  //   const userStartTime = new Date(bookingData.startTime);
  //   const userEndTime = new Date(bookingData.endTime);

  //   // Parse ny_start_time and ny_end_time into Dates based on bookingDate
  //   const yachtNewYearStart = new Date(bookingDate);
  //   const yachtNewYearEnd = new Date(bookingDate);

  //   const [startHours, startMinutes, startSeconds] = nyStartTime.split(':').map(Number);
  //   yachtNewYearStart.setHours(startHours, startMinutes, startSeconds || 0);

  //   const [endHours, endMinutes, endSeconds] = nyEndTime.split(':').map(Number);
  //   yachtNewYearEnd.setHours(endHours, endMinutes, endSeconds || 0);

  //   // console.log("User Start:", userStartTime, "Yacht NY Start:", yachtNewYearStart);
  //   // console.log(  "User End:", userEndTime,"Yacht NY End:", yachtNewYearEnd);

  //   isWithinNewYearEveTime =
  //     userStartTime >= yachtNewYearStart && userEndTime <= yachtNewYearEnd;
  // }

  // console.log("isNewYearsEve:", isNewYearsEve, "isWithinNewYearEveTime:", isWithinNewYearEveTime);

  if (isNewYearsEve && isWithinNewYearEveTime) {
    check = true;
  } else {
    check = false;
  }


  return check;
};


export const formatHumanReadableTime = (timeString) => {
  if (!timeString) return '';

  const parsedTime = parse(timeString, 'HH:mm:ss', new Date());
  return format(parsedTime, 'HH:mm'); // Example: 18:00

  //12 hours format

  //   const parsedTime = parse(timeString, 'HH:mm:ss', new Date());
  //   return format(parsedTime, 'hh:mm a'); // Example: 06:00 PM
};



export const generateNewYearStartTimeSlots = (ny_start_time, ny_end_time) => {
  return generateTimeSlotsInRange(ny_start_time, ny_end_time);
};

export const generateNewYearEndTimeSlots = (ny_start_time, ny_end_time) => {
  return generateTimeSlotsInRange(ny_start_time, ny_end_time);
};

function generateTimeSlotsInRange(startStr, endStr) {
  const slots = [];
  if (!startStr || !endStr) return slots;

  try {
    const base = new Date();
    let start = parse(startStr, 'HH:mm:ss', base);
    let end = parse(endStr, 'HH:mm:ss', base);

    // Handle overnight range (e.g. 23:00 to 01:00)
    if (end <= start) {
      end = addHours(end, 24);
    }

    let current = new Date(start);
    while (current <= end) {
      slots.push(format(current, 'HH:mm'));
      current = addHours(current, 1);
    }

    return slots;
  } catch (err) {
    console.error("Failed to generate time slots:", err);
    return [];
  }
}