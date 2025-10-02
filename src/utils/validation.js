const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is invalid");
  } else if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Email is invalid");
  } else if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};

const validateProfileEditData = (req,next) => {
  const allowEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((fields) => allowEditFields.includes(fields));

  return isEditAllowed;
};

module.exports = {validateSignupData,validateProfileEditData}
