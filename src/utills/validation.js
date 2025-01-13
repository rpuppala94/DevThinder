const validDataProfile = (req) => {
  const validFields = ["age", "gender", "photoUrl", "about", "skills"];

  const isValidFields = Object.keys(req.body).every((field) =>
    validFields.includes(field)
  );

  return isValidFields;
};

module.exports = { validDataProfile };
