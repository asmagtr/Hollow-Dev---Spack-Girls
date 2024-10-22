const mongoose=require("mongoose");


async function connectToDB(url){
    await mongoose.connect(url,{
        dbName:"fileUploader",
    });

    console.log("connected to the databse");

}

module.exports=connectToDB;