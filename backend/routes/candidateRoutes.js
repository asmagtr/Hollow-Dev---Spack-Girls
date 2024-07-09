const express=require("express");
const mongoose = require("mongoose");

const User=require("../models/userModel");
const Candidate=require("../models/candidateModel");
const authToken=require("../middlewares/authToken.js");
const getInfo=require("../utils/getInfo.js")


const route=express.Router();



route.post("/add-candidate",authToken,async(req,res)=>{
    const user=req.user;
    if(user.role!="admin"){

        return res.status(403).json({
            error:true,
            message:"only admin have permission to add candidats",
        })
    }
    
    futureCandidateId=req.body.candidateId;

   


    if(!futureCandidateId){
        return res.status(400).json({
            error:true,
            message:"provide the id of the user",
        })
    }


    try {
     //first we check if the id is for an existing user

     const isUser=await User.findById(futureCandidateId);
     if(!isUser){
        return res.status(404).json({
            error:true,
            message:"user doesn't exist",
        });
    }
    
    //check that he is not an admin
    if(isUser.role==="admin"){
        return res.status(400).json({
            error:true,
            message:"an admin can't be a candidate",
        });
    };
     


    //we check if he is already an candidate 

    const isAlreadyCandidate=await Candidate.findOne({userId:futureCandidateId});

    if(isAlreadyCandidate){
        return res.status(400).json({
            error:true,
            message:"user is already a candidate",
        });
    }
    const newid=isUser._id;

    //we check if he is a normal user
    if(isUser.role!="user"){
        return res.status(400).json({
            error:true,
            message:"candidate must be regisetered as a normal user",
        });
    }
    const result=await Candidate.create({userId:newid})

    return res.json({
        error:false,
        message:"candidate added successfully",
        result,
    });
}catch(error){

    
    return res.status(500).json({
        error:false,
        message:"server error",
    });

}

})

route.post("/add-candidate-by-username",authToken,async(req,res)=>{
    const user=req.user;
    if(user.role!="admin"){

        return res.status(403).json({
            error:true,
            message:"only admin have permission to add candidats",
        })
    }
    
   const futureCandidateUsername=req.body.candidateUsername;

   


    if(!futureCandidateUsername){
        return res.status(400).json({
            error:true,
            message:"provide the username of the user",
        })
    }


    try {
     //first we check if the id is for an existing user

     const isUser=await User.findOne({username:futureCandidateUsername});
     if(!isUser){
        return res.status(404).json({
            error:true,
            message:"user doesn't exist",
        });
    }

    //check that he is not an admin
    if(isUser.role==="admin"){
        return res.status(400).json({
            error:true,
            message:"an admin can't be a candidate",
        });
    };
     

    //we check if he is already an candidate 

    const isAlreadyCandidate=await Candidate.findOne({userId:isUser._id});

    if(isAlreadyCandidate){
        return res.status(400).json({
            error:true,
            message:"user is already a candidate",
        });
    }
    const newid=isUser._id;

    //we check if he is a normal user
    if(isUser.role!="user"){
        return res.status(400).json({
            error:true,
            message:"candidate must be regisetered as a normal user",
        });
    }
    const result=await Candidate.create({userId:newid})

    return res.json({
        error:false,
        message:"candidate added successfully",
        result,
    });
}catch(error){

    
    return res.status(500).json({
        error:false,
        message:"server error",
    });

}

})

route.get("/get-candidate-info-by-id/:id",authToken,async(req,res)=>{
    const user=req.user;
    if(user.role!="admin"){

        return res.status(403).json({
            error:true,
            message:"only admin have permission to add candidats",
        })
    }
    const id=req.params.id;
    if(!id){

        return res.status(404).json({
            error:true,
            message:"provide an id",
        })
    }


     res=getInfo(id,res);
     return res;


    


})


route.get("/get-candidate-info-by-username/:username",authToken,async(req,res)=>{
    const user=req.user;
    if(user.role!="admin"){

        return res.status(403).json({
            error:true,
            message:"only admin have permission to add candidats",
        })
    }

    const username=req.params.username;
    if(!username){
        return res.status(400).json({
            error:true,
            message:"provide a username",
        })

    }
    let result;
    try {
        result=await User.findOne({username});
        if(!result){
            return res.status(404).json({
                error:true,
                message:"no user found",
            });

        }


        
    } catch (error) {
        return res.status(500).json("server error");
        
    }

    id=result._id;
    
    res=getInfo(id,res);
    return res;


}
)

module.exports=route;