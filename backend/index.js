const express=require("express");
require("dotenv").config();
const cors = require("cors");

const authRoute=require("./routes/authRoutes");
const candidateRoute=require("./routes/candidateRoutes");
const voteRoute=require("./routes/voteRoutes");
const connectDB=require("./config/connectDB");
const logger=require("./winston/winstonLogger");
const app=express();

const morgan =require('morgan');

const morganFormat = ':method :url :status :response-time ms';
app.use(express.json());


app.use(morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logParts = message.trim().split(' ');
        const logObject = {
          method: logParts[0],
          url: logParts[1],
          status: logParts[2],
          responseTime: logParts[3],
        };
      logger.info(JSON.stringify(logObject));
      }
    }
  }));





app.use("/auth",authRoute);
app.use("/candidate",candidateRoute);
app.use("/vote",voteRoute);









const PORT=process.env.PORT || 3000;

async function start(){
   try{
       await connectDB(process.env.MONGO_URI);
       app.listen(PORT,function(){
           console.log("server running on port"+PORT)
        })

   }catch{
       console.log("error");
   }
  
}

start();