const express=require("express");
const mongoose = require("mongoose");

const User=require("../models/userModel");
const Candidate=require("../models/candidateModel");
const Vote=require("../models/voteModel");
const authToken=require("../middlewares/authToken.js");

const route=express.Router();


route.post("/add-vote",authToken,async (req,res)=>{
   var user=req.user;
   if(user.voted){
   return res.status(403).json({
        error:true,
        message:"you have already voted",
    });
   }

   const candidateId=req.body.candidateId
   if(!candidateId){
    return res.status(400).json({
        error:true,
        message:"provide a candidate id",
    });
}


   try{
   const candidate=await Candidate.findById(candidateId);
   if(!candidate){
    return res.status(404).json({
        error:true,
        message:"candidate not found",
    });

   }
   const userId=user._id;

   const result=await Vote.create({
    userId,
    candidateId,
   });

   candidate.votes=candidate.votes+1;
   candidate.save();
   user.voted=true;
   user=await User.findById(userId);
   user.voted=true;
   user.save();

   return res.json({
    error:false,
    message:"voted successfully",

});

   }catch(error){

    return res.status(500).json({
        error:true,
        message:"server error",
    });

   }




});

route.post("/add-vote-by-username",authToken,async (req,res)=>{
    var user=req.user;
    if(user.voted){
    return res.status(403).json({
         error:true,
         message:"you have already voted",
     });
    }
 
    const candidateUsername=req.body.candidateUsername;
    if(!candidateUsername){
     return res.status(400).json({
         error:true,
         message:"provide a candidate userName",
     });
 }
 
  
    try{
     let candidate;
     candidate=await User.findOne({username:candidateUsername});
    if(!candidate){
        return res.status(404).json({
            error:true,
            message:"user not found",
        });

    }
    candidate=await Candidate.findOne({userId:candidate._id});
    if(!candidate){
     return res.status(404).json({
         error:true,
         message:`${candidateUsername} is not a candidate`,
     });
 
    }
    const userId=user._id;
    const candidateId=candidate._id
 
    const result=await Vote.create({
     userId,
     candidateId,
    });
 
    candidate.votes=candidate.votes+1;
    candidate.save();
    user.voted=true;
    user=await User.findById(userId);
    user.voted=true;
    user.save();
 
    return res.json({
     error:false,
     message:"voted successfully",
 
 });
 
    }catch(error){
 
     return res.status(500).json({
         error:true,
         message:"server error",
     });
 
    }
 
 
 
 
 });

module.exports=route;
