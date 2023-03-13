const jwt =require('jsonwebtoken')
const {userModel} = require("../model/user.model") 
const {blacklist} = require("../config/blacklist") 
require("dotenv").config()
const authMiddleWare = async(req,res,next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        if(blacklist.includes(token)){
            return res.send("Please Login again")
        }
        const decodedToken = jwt.verify(token,process.env.secret)
        const {userId} = decodedToken;
        //Checking if user exists
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(401).json({message:"Unauthorized"})
        }
        req.user = user;
        next()
    } catch (error) {
        return res.status(401).json({message:error.message})
    }
}
module.exports = {authMiddleWare}