const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const Authenticate =async(req,res,next)=>{
    try{
        const token =req.cookie.jwtoken;
        const verifyToken = jwt.verify(token,process.env.SECRET_KEY);

        const rootUser = await User.findOne({_id:verifyToken._id,"tokens.token":token})

        if(!rootUser){
            throw new Error("user not found")
        }   
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
    }catch{
        res.status(401).send("unauthorized:No token provide ");
        console.log(err);
    }
}

module.exports = Authenticate;