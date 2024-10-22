const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

const uploadToCloud=async(file)=>{
 
    try{
        const result=await cloudinary.uploader.upload(file, {resource_type: "auto"})
        return result.url;
    }catch(error){
        return null;
    }

}

module.exports=uploadToCloud;