import axios from 'axios';

const BASE_URL = 'https://api.takeoffyachts.com/wishlist/wishlistview/';

// export const addToWishlist = async (userId, yachtId) => {
//   const response = await axios.post(BASE_URL, {
//     Auth_user: userId,
//     yacht: yachtId,
//   });
//   return response.data;
// };
// export const addToWishlist = async (userId, itemId, isYacht = true) => {
//   const payload = {
//     Auth_user: userId,
//   };

//   // Conditional check to determine if the item is a yacht or experience
//   if (isYacht) {
//     payload.yacht = itemId; // Use yacht key for yacht IDs
//   } else {
//     payload.experience = itemId; // Use experience key for experience IDs
//   }

//   const response = await axios.post(BASE_URL, payload);
//   return response.data;
// };
export const addToWishlist = async (userId, itemId, itemType) => {
  const payload = {
    Auth_user: userId,
  };

  // Conditional check to determine if the item is a yacht, experience, or event
  if (itemType === 'yacht') {
    payload.yacht = itemId; // Use yacht key for yacht IDs
  } else if (itemType === 'experience') {
    payload.experience = itemId; // Use experience key for experience IDs
  } else if (itemType === 'event') {
    payload.event = itemId; // Use event key for event IDs
  }

  const response = await axios.post(BASE_URL, payload);
  return response.data;
};

export const removeFromWishlist = async (userId, itemId, itemType) => {
  let url = '';

  // Determine the correct endpoint based on itemType
  if (itemType === 'yacht') {
    url = `${BASE_URL}remove_yacht/?yacht_id=${itemId}&Auth_user=${userId}`;
  } else if (itemType === 'experience') {
    url = `${BASE_URL}remove_experience/?experience_id=${itemId}&Auth_user=${userId}`;
  } else if (itemType === 'event') {
    url = `${BASE_URL}remove_event/?event_id=${itemId}&Auth_user=${userId}`;
  }

  // Make the DELETE request to the appropriate endpoint
  await axios.delete(url);
};


export const fetchWishlist = async (userId) => {
  const response = await axios.get(BASE_URL);
  return response.data.filter(item => item.Auth_user === userId);
};