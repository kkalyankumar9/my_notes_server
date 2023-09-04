const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const {UserModel} =require("../models/userModel")
const { BlackListModule } = require("../models/blackList");

const userRoutes = express.Router();

userRoutes.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await UserModel.find({ email });
    console.log(user);
    if (user.length) {
      return res.status(400).send({ msg: "User is Already exists" });
    } else {
      if (validatePassword(password)) {
        // console.log(password);
        bcrypt.hash(password, 2, async (err, hash) => {
          // Store hash in your password DB.
          if (err) {
            res.status(400).send({ err: err });
          } else {
            const data = new UserModel({ name, email, password: hash });
            await data.save();
            res.status(200).send({ msg: "user as Signup" });
          }
        });
      } else {
        res.status(400).send({ msg: "Make Stonge password" });
      }
    }
  } catch (error) {
    res.status(400).send({ err: error });
  }
});
userRoutes.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    console.log(user);
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        // result == true
        if (result) {
          const token = jwt.sign({ userID: user._id, user: user.name }, "app", {
            expiresIn: 300,
          });

          const refreshtoken = jwt.sign(
            { userID: user._id, user: user.name },
            "notes",
            { expiresIn: 600 }
          );

          res.status(200).send({
            msg: "Login successfull",
            token: token,
            refreshtoken: refreshtoken,
          });
        } else {
          res.status(400).send({ err: "password does not match" });
        }
      });
    } else {
      res.status(400).send({ err: "email not match" });
    }
  } catch (error) {
    res.status(400).send({ err: error });
  }
});

userRoutes.get("/logout", async (req, res) => {
  const headers = req.headers.authorization;
  try {
    if (headers) {
      console.log("Token to be blacklisted:", headers);

      await BlackListModule.updateMany({}, { $push: { blacklist: [headers] } });

      console.log("Updated blacklist:", headers);

      res.status(200).send({ msg: "User has Successfully Logout!!" });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = { userRoutes };

function validatePassword(password) {
  const pattern =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~])(?=.{8,})/;

  return pattern.test(password);
}
