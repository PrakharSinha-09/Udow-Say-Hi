const jwt = require("jsonwebtoken");
let JWT_SECRET="prakhar09"
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
