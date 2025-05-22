import { subHours, isBefore, parseISO,isAfter,startOfDay, isEqual } from 'date-fns';

export const checkBookingCanCancel = (bookingType, bookingDetails) => {
  if (bookingType === "past" || bookingType === "cancel") return false;

  const bookingDateTime = new Date(bookingDetails?.selected_date); // full date + time
  const cancelHoursBefore = Number(bookingDetails?.cancel_time_in_hour || 30);

  const cancelDeadline = subHours(bookingDateTime, cancelHoursBefore); // cancel allowed before this time
  const now = new Date();

//   const canCancel = isBefore(now, cancelDeadline);
  const canCancel = true;


//   console.log("Now:", now);
//   console.log("Booking DateTime:", bookingDateTime);
//   console.log("Cancel Deadline:", cancelDeadline);
//   console.log("Can Cancel:", canCancel);

  return canCancel;
};



export const classifyBookings = (bookings = []) => {
    const today = startOfDay(new Date());
  
    const upcoming = [];
    const past = [];
    const cancel = [];
//  console.log("cancel bookings=>",bookings.filter((booking) => booking?.cancel === true))
//  console.log("not cancel bookings=>",bookings.filter((booking) => booking?.cancel === false))

    bookings.forEach((booking, index) => {

      if(booking?.type == "f1yachts"){
        if (!booking?.end_date) {
          console.error(`Missing or invalid end_date in booking at index ${booking?.id}:`, booking);
          return;
        }
      
        let bookingDate;
        try {
          bookingDate = startOfDay(parseISO(booking.end_date));
        } catch (err) {
          console.error(`Error parsing end_date "${booking.end_date}" at index ${index}`, err);
          return;
        }
      
        if (booking.cancel) {
          cancel.push(booking);
        } else if (isAfter(bookingDate, today) || isEqual(bookingDate, today)) {
          upcoming.push(booking);
        } else {
          past.push(booking);
        }
      }else if(booking?.type == "event"){
        if (!booking?.selected_date) {
          console.error(`Missing or invalid selected_date in booking at index ${booking?.id}:`, booking);
          return;
        }
      
        let bookingDate;
        try {
          bookingDate = startOfDay(parseISO(booking.selected_date));
        } catch (err) {
          console.error(`Error parsing selected_date "${booking.selected_date}" at index ${index}`, err);
          return;
        }
      
        if (booking.cancel) {
          cancel.push(booking);
        } else if (isAfter(bookingDate, today) || isEqual(bookingDate, today)) {
          upcoming.push(booking);
        } else {
          past.push(booking);
        }
      }else{
        if (!booking?.selected_date) {
          console.error(`Missing or invalid selected_date in booking at index ${booking?.id}:`, booking);
          return;
        }
      
        let bookingDate;
        try {
          bookingDate = startOfDay(parseISO(booking.selected_date));
        } catch (err) {
          console.error(`Error parsing selected_date "${booking.selected_date}" at index ${index}`, err);
          return;
        }
      
        if (booking.cancel) {
          cancel.push(booking);
        } else if (isAfter(bookingDate, today) || isEqual(bookingDate, today)) {
          upcoming.push(booking);
        } else {
          past.push(booking);
        }
      }
        
     
      });
  
    return { upcoming, past, cancel };
  };

