const express=require("express");
require("dotenv").config();
const cors = require("cors");

const authRoute=require("./routes/authRoutes");
const candidateRoute=require("./routes/candidateRoutes");
const voteRoute=require("./routes/voteRoutes");
const connectDB=require("./config/connectDB");
const winstonLogger=require("./winston/winstonLogger");
const app=express();



app.use(express.json());
app.use(
    cors({
        origin:"*",
    })
);

app.use("/auth",authRoute);
app.use("/candidate",candidateRoute);
app.use("/vote",voteRoute);









const PORT=process.env.PORT || 3000;

async function start(){
   try{
       await connectDB(process.env.MONGO_URI);
       app.listen(PORT,function(){
           console.log("server started")
        })

   }catch{
       console.log("error");
   }
  
}

start();