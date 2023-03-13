const mongoose = require("mongoose")
const productSchema = mongoose.Schema({
  item_name:String,
  quantity:Number,
  category:String
},{
    versionKey:false
})
const productModel = mongoose.model("product",productSchema)
module.exports ={productModel}