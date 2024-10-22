const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer  = require('multer');
const cors=require("cors");
const app = express();
app.use(cors());
app.use(cors({
    origin: '*'
  }));
app.use(express.json());
  // Route to get the full URL
app.use("/uploads",express.static("uploads"))

const fileRouter=require("./routes/fileRoutes")
const connectToDB=require("./connectToDB")

dotenv.config();

app.use("/",fileRouter);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;










app.listen(PORT,async () => {
    console.log(`Server is running on port ${PORT}`);
    try{
        await connectToDB(MONGO_URI);
    }catch{
        console.log("error in connection to database ");
    }
  });