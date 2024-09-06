const express = require("express");
const adrout = express.Router();
const User = require("../modules/userM");
const Service = require("../modules/service");
require("dotenv").config();
const mail=require('../general/mail');
const { MongoClient } = require('mongodb');
const veftok = require("../middleware/decoder");
const { json } = require("body-parser");
const client = new MongoClient('mongodb://localhost:27017/');

adrout.get("/getall", async (req, res) => {
    try {
        const yui = await User.find({});
        if (yui && yui.length >= 0) {
            res.status(200).json({ us: yui });
        } else {
            res.status(404).json({ error: "No users found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
adrout.get("/ut/:id", async (req, res) => {
    const uid = req.params.id;
    console.log("USer INFO");
    try {
        const uuser = await User.findOne({ uid: uid });
        if (uuser) {
            console.log("success")
            res.status(200).json({ message: " successful",dt:uuser });
        } else {
            console.log("failed")
            res.status(404).json({ message: "User not found in db" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

adrout.post("/deleteus/:id", async (req, res) => {
    const uid = req.params.id;
    try {
        const deletedUser = await User.deleteOne({ uid: uid });
        if (deletedUser.deletedCount === 1) {
            res.status(200).json({ message: "Deletion successful" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
adrout.post("/approval/:id", async (req, res) => {
    const { Approved, technicianName, maill } = req.body;
    const serviceid = req.params.id;
    console.log(Approved, technicianName);
    try {
      // Assuming User is the correct model to update and serviceid is unique identifier
      await Service.findOneAndUpdate({ serviceid: serviceid }, { Approval: Approved, technicianName: technicianName });
      if (Approved == 1) {
        const opp = mail(maill, "✌️your Slot has been booked✌️", `Hi sir, your request for car service has been approved`);
        if (opp == 1) {
          console.error("Error occurred while sending email:");
          return res.status(401).json({ message: "Failed to send email" });
        } else {
          console.log("Email sent:");
          return res.status(201).json({ message: "Email sent successfully" });
        }
      }
      console.log("DONE");
      return res.status(200).json({ message: "Slot updated successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

adrout.get("/getallp",veftok,async (req, res) => {
    try {
        await client.connect();
        const database = client.db('carpulse');
        const pip = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'uid',
                    foreignField: 'uid',
                    as: 'servicedet'
                },
            },
            {
                $unwind: '$servicedet'
            }
        ];
        const yui = await database.collection('services').aggregate(pip).toArray();
        if (yui && yui.length > 0) {
            res.status(200).json({ us: yui });
        } else {
            res.status(404).json({ error: "No users found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close(); // Ensure client is closed after the operation
    }
});

adrout.post('/statusup/:serviceid/:app/:maill', async (req, res) => {
    try {
        const { serviceid, app, maill } = req.params;
        console.log(serviceid, app,maill);
        let t = "";
        
        if (app === '2') {
            t = "Onboarddate";
        } else if (app === '3') {
            t = "completion";
        }
        
        // Use await directly on findOneAndUpdate and remove .then()
        await Service.findOneAndUpdate({ serviceid: serviceid }, { Approval: app, $set: { [t]: Date.now() } });

        const opp = mail(maill, "✌️updation on your booking slot✌️", `Hi sir, your request for car service has been approved ${t} State`);
        
        if (opp === 1) {
            console.error("Error occurred while sending email:");
            return res.status(401).json({ message: "Failed to send email" });
        } else {
            console.log("Email sent:");
            return res.status(201).json({ message: "Email sent successfully" });
        }
        
        console.log("DONE"); // This line will never be reached because of the returns above

        return res.status(200).json({ message: "Slot updated successfully" });
    } catch (error) {
        console.error('Error updating approval:', error);
        return res.status(500).send('Error updating approval');
    }
});

  
  
// Handle SIGINT event to close MongoDB client
process.on('SIGINT', async () => {
    await client.close();
    process.exit(0);
});

module.exports = adrout;
