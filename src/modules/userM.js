const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    umail: {
        type: String,
        required: true
    },
    uname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    upassword: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    uadd: {
        type: String,
        required: true
    },
    dt: {
        type: Date,
        default: Date.now,
        required: true
    },
    role:{
        type:Number,
        default:0
    },
    resetpwtoken: String,
    resetpwtokexp: Date
});

const User = mongoose.model("User", userSchema);

module.exports = User;
