const convertObjectToString = (obj) => {
  // create object without empty fields
  const newObj = Object.entries(obj).filter((el) => el[1] !== "");

  return newObj
    .map((el) => {
      return el.join(":\t");
    })
    .join(",\t");
};

module.exports = {
  convertObjectToString,
};
