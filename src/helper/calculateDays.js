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