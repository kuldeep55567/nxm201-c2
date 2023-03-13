const express = require("express")
const productRouter = express.Router()
const {userModel} = require("../model/user.model")
const  {productModel} = require("../model/product.model")
const {authMiddleWare} = require("../middleware/auth")

//Checking user role here only as we don't have big data
const authorize = (Permissions)=>{
    return(req,res,next)=>{
        const role = req.userModel.role
        if(role===Permissions){
            next()
        }else{
            res.send("Unauthorized")
        }
    }
}
productRouter.get("/products", authMiddleWare,async(req,res)=>{
 const product = await productModel.find()
res.send(product)
})
productRouter.post("/addproducts",authorize,async(req,res)=>{

try {
    const product = new productModel(req.body)
    product.save()
    res.send({message:"Product added successfully"})
} catch (error) {
    console.log(error)
    res.send({mssg:error.mssg})
}
})
productRouter.delete("/deleteproducts/:id",authorize, async(req,res)=>{
    let id = req.params.id
    try {
        await productModel.findByIdAndDelete({_id:id})
        res.send(`Product with ID ${id} has been successfully deleted !`)
    } catch (error) {
        res.send({message:error.message})
    }
})
module.exports ={productRouter}