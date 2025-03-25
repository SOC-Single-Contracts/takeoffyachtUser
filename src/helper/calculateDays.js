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
  