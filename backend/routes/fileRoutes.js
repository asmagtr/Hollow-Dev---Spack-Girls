const express = require('express');
const multer  = require('multer')
const router =express.Router();
const verifyFields=require("../middleware/fileMiddleware");
const fileModel=require("../models/fileModel.js");
const fs = require('fs');
const path = require('path');

const uploadToCloud=require('../cloudinary/cloudinaryUpload.js')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,uniqueSuffix+ file.originalname)
    },
  })
  
const upload = multer({ storage: storage });


//API TO GET ALL FILEs
router.get("/get-all",async (req,res)=>{
    try{
        files=await fileModel.find();
        return res.json({
            error:false,
            files:files,
        })
    }catch(error){
        return res.status(error).json({
            error:true,
            message:"internal service error"
        })
    }
    
});




///API TO UPLOAD FILES 
router.post('/upload', upload.single('file'), verifyFields,async function (req, res, next) {
    const title=req.body.title;
    const description=req.body.description || "";
    const fileName=req.file.filename;

    try{
        const filepath = path.join(__dirname, '../uploads',fileName);
        const fileCloudinaryURL= await uploadToCloud(filepath);

        const result=await fileModel.create({
            title,
            description,
            file:fileName,
            fileCloudinary:fileCloudinaryURL,
        });

        res.json({error:false,
            message:"file uploaded succesfully",
            result,
        });
        



        
    }catch(error){
        res.status(error).json({
            error:true,
            message:"internal Server Error"
        });
        return;
    }
  
  });


  //API TO RETRIVE FILE INFORMATION BY ID

router.get("/get-file-info/:id", async (req, res) => {
    const id = req.params.id;
    // we get the file from db 
    try {
      const fileInfo = await fileModel.findById(id);
      
      if (!fileInfo) {
        return res.status(404).json({
          error: true,
          message: "File not found"
        });
      }

      //we get its path in our uploads folder in the server
  
      const fileName = fileInfo.file;
      const filePath = path.join(__dirname, "../uploads/", fileName);
  
      // we get file stats
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return res.status(500).json({
            error: true,
            message: 'Error getting file information'
          });
        }
  
        // we put the infos in fileInfo
        res.json({
          error: false,
          fileInfo: {
            title:fileInfo.title,
            description:fileInfo.description,
            lastModifiedDate: stats.mtime,
            name: fileName,
            size: stats.size,
            type: getMimeType(fileName) // Function to get MIME type based on file extension
          }
        });
      });
  
    } catch (error) {
      console.error('Error retrieving file information:', error);
      return res.status(500).json({
        error: true,
        message: 'Internal server error'
      });
    }
  });
  
  // Helper function to get MIME type based on file extension
  function getMimeType(fileName) {
    const ext = path.extname(fileName);
    switch (ext.toLowerCase()) {
      case '.pdf':
        return 'application/pdf';
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      default:
        return 'application/octet-stream';
    }
  }







  //API TO UPDATE INFORMATION BY ID

router.put("/update-file/:id",async (req,res)=>{
    const title=req.body.title;
    const description=req.body.description;
    const id=req.params.id
    if(!title && !description ){
        return res.status(400).json({
            error:true,
            message:"fill at least one field",
        });
    }
  try{
    const file=await fileModel.findById(id);
    if(!file){
        return res.status(400).json({
            error:true,
            message:"file not found",
        });
    }
    if(title) file.title=title;
    if(description) file.description=description;

    await file.save();
    return res.json({
        error:false,
        message:"updated successfully",
        file
    })
  }catch(error){
    return res.status(404).json({
        error:true,
        message:"internal server error",
    });
  }
})





  //API TO RETRIEVE FILE BY ID
  router.get("/get-file/:id",async(req,res)=>{
    const id=req.params.id;
    try{
        const response=await fileModel.findById(id);

    if(!response){
        return res.status(404).json({
            error:true,
            message:"no file found"
        });
    }
    const fileName=response.file;


    const filePath="http://localhost:"+process.env.PORT+"/uploads/"+fileName;

    return res.json({
        error:false,
        message:"file found",
        filePath,
        response
    });
    }catch(error){
        return res.status(error).json({
            error:true,
            message:"server error"
        })
    }
  })






  //API TO DELETE FILE 
  
  router.delete("/delete-file/:id",async(req,res)=>{
    const id=req.params.id;
   try{
    const file=await fileModel.findById(id);
    if(!file){
        return res.status(404).json({
            error:true,
            message:"no file found"
        });
    }
    //first we delete it from the server than the db
    // const filepath="../uploads/"+file.file;
    const filepath = path.join(__dirname, '../uploads', file.file);
  
    fs.unlinkSync(filepath);
    await fileModel.findByIdAndDelete(id);
    return res.json({
        error:false,
        message:"file deleted successfully"
    });

   }catch(error){
    return res.status(error).json({
        error:true,
        message:"server error"
    });
   }
  })

  module.exports=router;
