const jwt=require("jsonwebtoken");


function generateToken(id){
    const token=jwt.sign({
        id,
        },
            process.env.JWT_SECRET  ,{
                expiresIn:"3600m",
            }
    );

    return token;

}

function verifyToken(token){


    try{
       const data= jwt.verify(token,process.env.JWT_SECRET);

       return data;

    } catch{
            return null;
    }





}





module.exports={generateToken,
    verifyToken
};