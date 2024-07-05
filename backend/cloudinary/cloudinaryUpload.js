const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

const uploadToCloud=async(image)=>{
    console.log("the image is"+image);
    try{
        const result=await cloudinary.uploader.upload(image)
        console.log("file is saved in cloudinary , here is the link"+result.url)   ;
    }catch(error){
        console.log(error)
    }

}

module.exports=uploadToCloud;