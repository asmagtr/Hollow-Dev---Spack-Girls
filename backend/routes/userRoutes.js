const express=require("express");
const mongoose = require("mongoose");

const userModel=require("../models/userModel");
const authToken=require("../middlewares/authToken.js");


const route=express.Router();
//api to get userinfo of the user authenticated
route.get("/me",authToken,async (req,res)=>{
    const user=req.user;
    return res.json({user:user});
})


//api to get user info by its id 
route.get("/get-user/:id",authToken,async (req,res)=>{
    const id=req.params.id;
    const user = await userModel.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({
        error:true,
        message:"no user found",
      });
    }

    return res.json({
        error:false,
        user:user
    });
})







module.exports=route