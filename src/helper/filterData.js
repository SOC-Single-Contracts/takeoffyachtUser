
 export  const initialFilterGlobal = ()=>{
    const data = {
        min_price: 1000,
        max_price: 4000,
        min_guest: "",
        max_guest: "",
        sleep_capacity: "",
        capacity: "",
        location: "",
        category_name: [],
        subcategory_name: [],
        boat_category: [],
        price_des: false,
        price_asc: false,
        cabin_des: false,
        cabin_asc: false,
        engine_type: "",
        number_of_cabin: "",
        created_on: "",
        min_length: "",
        max_length: "",
        amenities: [],
        outdoor_equipment: [],
        kitchen: [],
        energy: [],
        leisure: [],
        navigation: [],
        extra_comforts: [],
        indoor: [],
        startDate:"",
        endDate:"",
        sortBy:"default"
      };

      return data;


  }

  export const getMonthName = (val,months) => {
    const monthObj = months.find(m => m.value == val || m.value === val.padStart(2, '0'));
    return monthObj ? monthObj.name : val;
  };