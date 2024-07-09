const User=require("../models/userModel");
const Candidate=require("../models/candidateModel");


const getCandidateInfoByUserId=async(id,res)=>{

    try {
        const user=await User.findById(id);
        if(!user) {return res.status(500).json({
            error:true,
            message:"no user found",

        });}

        const candidate=await Candidate.findOne({userId:id});
        if(!candidate) {return res.status(500).json({
            error:true,
            message:"user is not a candidate",

        });}

        return res.json({
            error:false,
            username:user.username,
            fullNmae:user.fullName,
            email:user.email,
            votes:candidate.votes,

        });






    } catch (error) {
        return res.status(500).json({
            error:true,
            message:"internal server error",

        })
        
        
    }


}
module.exports=getCandidateInfoByUserId;