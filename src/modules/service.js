const mongoose=require("mongoose");
const m=new mongoose.Schema({
    umail:{
        type:String,
        requried:true
    },
    uname:{
        type:String,
        requried:true
    },
    uid:{
        type:String,
        requried:true
    },
    serviceid:{
        type:String,
        requried:true
    },
    booked: {
        type: Date,
        requried:true
    },
    Approval:{
        type:Number,
        default:0,
    },
    complaint:{
        type:String,
        require:true
    },
    typ:{
        type:String,
        require:true
    },
    technicianName:{
        type:String,
        default:"NOT SELECTED",
    },
    brand:{
          type:String,
          require:true
    },
    vnumber:{
        type:String,
          require:true
    },
    fuel:{
        type:String,
        require:true
    },
    bkdate: {
        type: Date,
        default: new Date(new Date().setHours(0, 0, 0, 0))
      },
    completion:{
        type: Date,
        default: new Date(new Date().setHours(0, 0, 0, 0))
    },
    requestdate:{
        type: Date,
        default: new Date(new Date().setHours(0, 0, 0, 0))
    },
    Approvaldate:{
        type: Date,
        default: new Date(new Date().setHours(0, 0, 0, 0))
    },
    Onboarddate:{
        type: Date,
        default: new Date(new Date().setHours(0, 0, 0, 0))
    }
});
const user=mongoose.model("services",m);
module.exports=user;