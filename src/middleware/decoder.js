const jwt = require('jsonwebtoken');
const User = require('../modules/userM');
require('dotenv').config();
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Token not found" });
    }

    const token = authHeader.split(" ")[1]; // Remove "Bearer " from token

    jwt.verify(token, process.env.SEC, async (err, decoded) => {
        if (err) {
            console.log("hi");
            console.log(err);
            return res.status(401).json({ message: "Invalid token" , exp:true });
        }

        try {
            const user = await User.findOne({ _id: decoded.id });
            if(!user){
                res.status(404).json({message:"not user found"})
            }
            req.user = user; // Attach user to request object for later use
            next();
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    });
};

module.exports = verifyToken;
