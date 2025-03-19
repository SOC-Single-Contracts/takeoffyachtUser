
 export  const initialBookingGlobal = ()=>{
    const bookingData = {};

      return bookingData;


  }

  export const handleDispatchBookingData = (data)=>{
    if (typeof window !== "undefined") {
        localStorage.setItem("bookingContext", JSON.stringify(data));
      }
  }