require('dotenv').config();
const mongoose=require("mongoose");
const dburl=process.env.DB_URL;
const connect = function()
{
  mongoose.connect(dburl,{family:4})
  .then((val)=>{
    console.log("The data base is connected");
}).catch((err)=>{
        console.log("Error in connecting to db"+ err);
    })
}
module.exports=connect;