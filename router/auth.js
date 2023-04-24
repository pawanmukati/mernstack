const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")

require("../db/connection");
const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middlewere/authenticate")

router.get("/", (req, res) => {
  res.send("Hello World");
});

// use promises
// router.post("/register", (req, res) => {
//   const { name, email, phone, work, password, cpassword } = req.body;
//   if (!name || !email || !phone || !work || !password || !cpassword) {
//     return res.status(400).json({
//       status: "error",
//       error: "req body cannot be empty",
//     });
//   }
//   User.findOne({ email: email })
//     .then((userExist) => {
//       if (userExist) {
//         res.status(400).json({
//           status: "error",
//           error: "already exist",
//         });
//         return;
//       }
//       const user = new User({ name, email, phone, work, password, cpassword });

//       user
//         .save()
//         .then(() => {
//           res.status(201).json({ message: "registered successfully" });
//         })
//         .catch((err) => res.status(500).json({ error: "failed registration" }));
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// use async
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(400).json({
      status: "error",
      error: "req body cannot be empty",
    });
  }
  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {

      return res.status(422).json({ status: "error", error: "already exist" });

    } else if (password != cpassword) {
      return res
        .status(422)
        .json({ status: "error", error: "password not match" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });

      const userRegistered = await user.save();

      if (userRegistered) {
        res.status(201).json({ message: "registered successfully" });
      } else {
        res.status(500).json({ error: "failed registration" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

// login route

router.post("/signin", async (req, res) => {
  try {

    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: "plz filled the data" });
    }

    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
      // return res.status(400).json({ error: "user error" });
      const isMatch = await bcrypt.compare(password, userLogin.password);

      const token = await userLogin.generateAuthToken();

      console.log(token)
      res.cookie("jwtoken",token,{
          expires:new Date(Date.now()+258920),
          httpOnly:true
      })

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid Credentials pass" });
      } else {
        return res.status(200).json({ message: "user signing successfully" });
      }
    } else {
      return res.status(400).json({ error: "Invalid Credentials email" });
    }
  } catch (err) {
    console.log(err);
  }
});

// about us
router.get("/about", authenticate ,(req, res) => {
  res.send(req.rootUser)
})
module.exports = router;
