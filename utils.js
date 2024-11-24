// utils.js
export const splitStringToArray = (str, delimiter = ', ') => 
  str ? str.split(delimiter).map(item => item.trim()).filter(Boolean) : [];

export const validateVideo = (video) => {
  const requiredFields = ['id', 'title', 'youtubeId'];
  const missingFields = requiredFields.filter(field => !video[field]);
  
  if (missingFields.length) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};
