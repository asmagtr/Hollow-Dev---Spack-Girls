const express = require('express');
const multer  = require('multer')
const router =express.Router();
const verifyFields=require("../middleware/fileMiddleware");
const fileModel=require("../models/fileModel.js");
const fs = require('fs');
const path = require('path');
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
        const result=await fileModel.create({
            title,
            description,
            file:fileName
        });

        res.json({error:false,
            message:"file uploaded succesfully",
            result,
        })
        
    }catch(error){
        console.log(error);
        res.status(error).json({
            error:true,
            message:"internal Server Error"
        });
        return;
    }
  
  });


  //API TO RETRIVE FILE INFORMATION BY ID







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
    console.log(filePath);
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
