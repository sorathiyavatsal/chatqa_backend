const jwt = require("jsonwebtoken");
const User = async (token) => {
  try {
    let authorization = token.split(" ")[1];
    let user = jwt.decode(authorization);
    return user;
  } catch (e) {
    console.log(e);
    logger.error(e.message);
    return req;
  }
};
module.exports = { User };
