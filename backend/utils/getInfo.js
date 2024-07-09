const User=require("../models/userModel");
const Candidate=require("../models/candidateModel");


const getCandidateInfoByUserId=async(id)=>{

    try {
        const user=await User.findById(id);
        if(!user) {return null}

        const candidate=await Candidate.findOne({userId:id});
        if(!candidate) {return null}

        return ({
            error:false,
            username:user.username,
            fullNmae:user.fullName,
            email:user.email,
            votes:candidate.votes,

        });






    } catch (error) {
        throw new Error();
        
        
    }


}
module.exports=getCandidateInfoByUserId;