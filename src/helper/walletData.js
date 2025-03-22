

  export const handleDispatchwalletData = (data)=>{
    if (typeof window !== "undefined") {
        localStorage.setItem("walletContext", JSON.stringify(data));
      }
  }