const express=require("express");
const mongoose = require("mongoose");

const User=require("../models/userModel");
const Candidate=require("../models/candidateModel");
const authToken=require("../middlewares/authToken.js");


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


module.exports=route;