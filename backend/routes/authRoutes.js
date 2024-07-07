const express=require("express");
const mongoose = require("mongoose");

const User=require("../models/userModel");

const hash=require("../utils/hash");
const jwtUtil = require("../utils/jwt");






const route=express.Router();



//Create Accout
route.post("/create-account",async(req,res)=>{

    const{fullName,username,email,password,role}=req.body;

    if(!fullName){
        return res
        .status(400)
        .json({error:true,message:"Full Name is required"});
    }
    if(!username){
        return res
        .status(400)
        .json({error:true,message:"username is required"});
    }

    if (!email){
        return res
        .status(400)
        .json({error:true,message:"emailis required"});

    }

    if (!password){
        return res
        .status(400)
        .json({error:true,message:"password is required"});

    }

try{

    var isUser=await User.findOne({email:email});
    if (isUser){
        return res
        .status(400)
        .json({error:true,message:"User already exists"});
    }
    isUser=await User.findOne({username:username});
    if (isUser){
        return res
        .status(400)
        .json({error:true,message:"username already exists"});
    }




   // if i wanted to make an admin account because by default role is set to normal 
   
   const hashedPassword = await hash.hashPassword(password);

   let user;
   if (role === 'admin') {
       user = new User({
           fullName,
           email,
           username,
           password: hashedPassword,
           role,
       });
   } else {
       user = new User({
           fullName,
           email,
           username:username,
           password: hashedPassword,
       });
   }






        const savedUser=await user.save();       
       const accessToken = jwtUtil.generateToken(savedUser._id);


    return res.json({
        error:false,
        user:savedUser,
        accessToken,
        message:"Registration Successful"
    });


    }catch(error){
        
        return res.status(500).json({
            error:true,
            message:"server error"
        });


    }


});

//Login
route.post("/login",async(req,res)=>{

    const {emailOrUsername,password}=req.body;
    if(!emailOrUsername){
        return res.status(400).json({message:"Email is required"});
    }
    if(!password){
        return res.status(400).json({message:"Password is required"});
    }


    try{
           //first we look if the provided body has an email 
   var userInfo =await User.findOne({email:emailOrUsername});
   //if not than we look for an account with that username
   if(!userInfo){
    userInfo =await User.findOne({username:emailOrUsername});
   }


   let isValidPassword;

   if(userInfo)
   {
     isValidPassword = await hash.comparePassword(password, userInfo.password);
   }

    if(userInfo && !isValidPassword){
        return res.status(400).json({message:"User not found"});
    }

    if(userInfo && isValidPassword){
        const user ={user:userInfo};
        const accessToken=jwtUtil.generateToken(userInfo._id);

        return res.json({
            error:false,
            message:"Login Successful",
            accessToken,
        });

    }else{
        return res.status(400).json({
            error:true,
            message:"Invalid Credentials",
        });
    }

    }catch(error){
          
        return res.status(500).json({
            error:true,
            message:"server error"
        });
    }
 

});

module.exports=route
