const express = require("express")
const userRouter = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {userModel} = require("../model/user.model")
const {blacklist} = require("../config/blacklist")
const tokenList={}
userRouter.get("/",async(req,res)=>{
    res.send( await userModel.find())
})
userRouter.post("/signup",async(req,res,next)=>{
try {
    const{name,email,password,role} = req.body
    const userExists = await userModel.findOne({email});
    //Checking if user exists
    if(userExists){
        return res.status(400).json({message:"User Already Exists"})
    }
//adding new users
const hashed = bcrypt.hashSync(password,9)
const user = new userModel({name,email,password:hashed,role})
await user.save()
res.json({message:"User Created successfully"})
} catch (error) {
    res.send({"mssg":error.message})
    next(error)
}
})
userRouter.post("/login", async(req,res)=>{
    try {
        const{email,password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(401).json({message:"User with this email not found"})
        }
        const isPasswordSame = await bcrypt.compare(password,user.password)
        if(!isPasswordSame){
            return res.status(401).json({message:"Invalid email or password"})
        }
        const token = jwt.sign({userId:user._id},process.env.secret,{expiresIn:'1hr'})
        const refreshToken = jwt.sign({userId:user._id},process.env.refresh_secret,{expiresIn:"3hr"})
   const response ={
    "status":"Logged In",
    "token":token,
    "refreshToken":refreshToken
   }
   tokenList[refreshToken] = response
   res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
})
userRouter.get("/logout",(req,res)=>{
    blacklist.push(req.headers.authorization?.split(" ")[1])
    res.send({message:"Logout Successfull !"})
})
module.exports={userRouter}