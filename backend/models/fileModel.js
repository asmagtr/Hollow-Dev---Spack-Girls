const mongoose=require("mongoose");

const Schema = mongoose.Schema;

const fileSchema = new Schema({
    title:String,
    file:String,
    description:String,
    fileCloudinary:String
},{collection:"Files"});

module.exports=mongoose.model("File",fileSchema);