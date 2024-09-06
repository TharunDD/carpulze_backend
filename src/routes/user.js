const express=require("express");
const bcrypt = require("bcryptjs");
const rot=express.Router();
const User=require('../modules/userM');
const tkngtr=require('../utils/hasher');
const veftok=require('../middleware/decoder');
const mail=require('../general/mail');

//test the basic
rot.get("/test",(req,res)=>{
    res.send("Hi success");
})
rot.post("/new",async (req,res)=>{
    const { umail, uname, phone, password, uid, city,zipcode, uadd } = req.body;

    try {
        const upassword=await bcrypt.hash(password,11);
        const newUser = new User({
            umail,
            uname,
            phone,
            upassword,
            uid,
            uadd,
            city,
            zipcode
        });
        await newUser.save();
        res.status(200).json({ message: 'User created successfully',uname });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
rot.post("/login",async(req,res)=>{
    try {
        const { umail, upassword } = req.body;
        console.log(umail);
      
        const user = await User.findOne({ umail });
        if (!user) {
          return res.status(404).send("User not found");
        }
      
        const isMatch = await bcrypt.compare(upassword, user.upassword);
        if (!isMatch) {
          return res.status(401).send("Invalid credentials");
        }
        const token = tkngtr(user);
        console.log(user.role);
        res.json({ token, role: user.role});
        console.log("Login Success");
      }catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send("Internal server error");
    }
})

rot.get("/geud/:id",veftok,async(req,res)=>{
    try {
        const {id}=req.params;
        const uid=req.user.uid;
        console.log(uid);
        const user = await User.findOne({uid});
        if (!user) {
          return res.status(404).send("User not found");
        }
        return res.status(200).json({user});
        console.log(user);
        console.log("Login Success");
      }catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send("Internal server error");
    }
})
rot.get("/data",veftok,(req,res)=>{
    res.json({message:`welcome, ${req.user.umail}! encypted`});
})
rot.post("/reset",async(req,res)=>{
    const {umail}=req.body;
    const user=await User.findOne({umail});
    if(!user){
       return  res.status(404).json({message:"User Not found"});
    }
    const tok=Math.random().toString(36).slice(-8);
    user.resetpwtoken=tok;
    user.resetpwtokexp=Date.now()+360000;
    await user.save();
   const opp= mail(umail, "chk", `to verify reset ${tok}`);
        if (opp==1) {
            console.error("Error occurred while sending email:");
            res.status(401).json({ message: "Failed to send email" });
        } else {
            console.log("Email sent:");
            res.status(201).json({ message: "Email sent successfully" });
        }
})
rot.post("/re/:token",async(req,res)=>{
    const {token}=req.params;
    console.log(token);
    const {np}=req.body;
    console.log(np);
    const user=await User.findOne({
        resetpwtoken:token,
        resetpwtokexp:{$gt : Date.now()}
    });
    if(!user){
        return res.status(404).json({message:"invalid token"});
    }
    const hashp=await bcrypt.hash(np,10);
    user.upassword=hashp;
    user.resetpwtoken=null;
    user.resetpwtokexp=null;
    await user.save();
    res.json({message:"password reset successfully"});

})
rot.get("/getall", veftok, async (req, res) => {
    try {
        const yui = await User.find({});
        if (yui) {
            res.status(200).json({ us: yui });
        } else {
            res.status(404).json({ error: "No users found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

rot.post("/:id",async (req,res)=>{
  const i=req.params.id;
  console.log("kl");
  const otp = Math.floor(1000 + Math.random() * 9000);
  try{
    const eu=await User.findOne({i});
    if(eu){
        return res.status(404).json({ message: 'User already exists' });
    }
    const opp= mail(i, "OTP Verfication", `this OTP:${otp} is valid only for 5 mins Enter it fast`);
        if (opp==1) {
            console.error("Error occurred while sending email:");
            res.status(401).json({ message: "Failed to send email" });
        } else {
            console.log("Email sent:");
            res.status(201).json({ message: "Email sent successfully", ot:otp});
        }
  }
  catch(error){
    console.log("from OTP"+error);
  }
})
module.exports=rot;