const express = require("express");
const rout = express.Router();
const User = require("../modules/userM");
const Service=require("../modules/service")
const tkngtr = require("../utils/hasher");
const veftok = require("../middleware/decoder");
const mail = require("../general/mail");
const uuid = require("uuid");
// const mail=require('../general/mail')

rout.post("/booking", veftok, async (req, res) => {
    const { name, comp, vechileno, pickTime,type,brand,carType } = req.body;
    console.log(name);
  
    try {
      const newUser = new Service({
        umail: req.user.umail,
        uname: name,
        uid: req.user.uid,
        complaint: comp,
        vnumber:vechileno,
        typ: carType,
        serviceid: uuid.v4(),
        Approval:false,
        brand,
        technicianName:"",
        fuel:type,
        booked: pickTime,
        requestdate:Date.now(),
        Onboarddate:Date.now(),
        Approvaldate:Date.now(),
        completion:Date.now(),
        statu: 0
      });
      await newUser.save();
      console.log(req.user.umail);
      res.status(200).json({ message: "User created successfully", name });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  rout.get("/gboking",veftok,async(req,res)=>{
    try {
        const {id}=req.params;
        const uid=req.user.uid;
        console.log("gbooking");
        const user = await Service.find({uid});
        if (!user) {
          return res.status(404).send("User not found");
        }
        console.log("Login Success");
        return res.status(200).json({user});
      }catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send("Internal server error");
    }
})
rout.post('/cancel/:serviceid', async (req, res) => {
  try {
    const{ serviceid} = req.params;
    console.log(serviceid, app);
    await Service.findOneAndUpdate({ serviceid: serviceid }, { Approval: -2 });
    res.status(200).json({ message: "Slot updated successfully" });
  } catch (error) {
    console.error('Error updating approval:', error);
    return res.status(500).send('Error updating approval');
  }
});

module.exports = rout;
