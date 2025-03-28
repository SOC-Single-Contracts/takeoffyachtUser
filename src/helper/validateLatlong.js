export const checkValidateLatLong = (yachts)=>{

    return yachts.filter(item => 
        typeof item?.yacht?.latitude === "number" &&
        typeof item?.yacht?.longitude === "number" &&
        !isNaN(item?.yacht?.latitude) &&
        !isNaN(item?.yacht?.longitude) &&
        item?.yacht?.latitude >= -90 && item?.yacht?.latitude <= 90 &&
        item?.yacht?.longitude >= -180 && item?.yacht?.longitude <= 180
    );

}