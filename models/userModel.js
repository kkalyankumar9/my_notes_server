const mongoose=require("mongoose")

const userSchema=mongoose.Schema({

    name:String,
    email:String,
    password:String
},{
    versionKey:false
})

const UserModel=new mongoose.model("user",userSchema)

module.exports={UserModel}