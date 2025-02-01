const {v4: uuidv4} = require("uuid");

const slugify = (str) => {
  return str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-əöğıüçş]/g, '')
      .replace(/-+/g, '-');
};

const generateUniqueSlug = (firstName, lastName, surName) => {
  const baseSlug = slugify(`${firstName} ${lastName} ${surName}`);
  const uniqueId = uuidv4().slice(0, 8);
  return `${baseSlug}-${uniqueId}`;
};



module.exports = generateUniqueSlug;