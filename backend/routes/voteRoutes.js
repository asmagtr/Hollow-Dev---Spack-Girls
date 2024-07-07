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
    result,
    user,
    candidate

});




});

module.exports=route;






module.exports=route;