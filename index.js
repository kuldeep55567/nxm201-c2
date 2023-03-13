const express = require("express")
const app = express()
const {connection} = require("./config/db")
const {userRouter} = require("./routes/user.route")
const {productRouter} = require("./routes/product.route")
app.use(express.json())
require("dotenv").config()
app.get("/",(req,res)=>{
    res.send({mssg:"Welcome to my Backend Server"})
})
app.use("/users",userRouter)
app.use(productRouter)
app.listen(process.env.port, async()=>{
    try {
        await connection
        console.log("Connected to Database");
    } catch (error) {
        console.log("Error while connecting")
    }
    console.log(`Server is runnning at port ${process.env.port}`)
})