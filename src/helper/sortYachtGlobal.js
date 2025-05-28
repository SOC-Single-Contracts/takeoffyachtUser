 export const handleSortYachtGlobal = (yachts, selectedOption, yachtsType) => {
     
    if (yachts.length <= 0) {
        return;
      }
  
      let data = [...yachts];
      if (selectedOption?.value === "default") {
        data = [...yachts];
      }
      else if (selectedOption?.value === "Price-High-Low") {
        if (yachtsType === "yachts") {
          data.sort((a, b) => (b.yacht?.per_hour_price) - (a.yacht?.per_hour_price));
        } else if (yachtsType === "f1yachts") {
          data.sort((a, b) => (b.yacht?.per_day_price) - (a.yacht?.per_day_price));
        }
      }
      else if (selectedOption?.value === "Price-Low-High") {
        if (yachtsType === "yachts") {
          data.sort((a, b) => (a.yacht?.per_hour_price) - (b.yacht?.per_hour_price));
        } else if (yachtsType === "f1yachts") {
          data.sort((a, b) => (a.yacht?.per_day_price) - (b.yacht?.per_day_price));
        }
      }
      else if (selectedOption?.value === "Capacity-High-Low") {
        data.sort((a, b) => b.yacht?.guest - a.yacht?.guest);
      } else if (selectedOption?.value === "Capacity-Low-High") {
        data.sort((a, b) => a.yacht?.guest - b.yacht?.guest);
      }
  
      return data;

  }
 

  export const buildCleanQuery = (params) => {
    const cleanParams = {};
  
    for (const key in params) {
      const value = params[key];
  
      const isEmpty =
        value === null ||
        value === undefined ||
        value === "" ||
        value === 0 ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0);
  
      if (!isEmpty) {
        cleanParams[key] = value;
      }
    }
  
    return new URLSearchParams(cleanParams).toString();
  };
  