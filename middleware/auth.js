const jwt = require("jsonwebtoken");
const { BlackListModule } = require("../models/blackList");

const auth = async (req, res, next) => {
  const headers = req.headers.authorization;
  try {
    if (headers) {
      const blacklisttoken = await BlackListModule.find({
        blacklist: { $in: headers },
      });
      if (blacklisttoken.length > 0) {
        return res.send({ msg: "Please Login 0!!" });
      }

      jwt.verify(headers, "app", (err, decoded) => {
        if (decoded) {
          req.body.user = decoded.user;
          req.body.userID = decoded.userID;
          next();
        } else {
          res.send({ msg: "Please Login Again 1!!" });
        }
      });
    } else {
      res.send({ msg: "Please Login Again 2!!" });
    }
  } catch (error) {
    res.send("Please Login Again 3!!");
  }
};
module.exports = { auth };
