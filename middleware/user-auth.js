const jwt = require("jsonwebtoken");
require("dotenv").config();

//generating usertoken
const generateToken = ({username ,useremail,userrole,userid,expiry = "15d"}) => {
    return jwt.sign({ username,useremail,userrole,userid}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expiry });
}

// authencatuon user token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ error: "User not authorized" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token" }); 
        }
        //console.log(decoded);
        req.user = decoded;
        next(); 
    });
}

module.exports = {
    generateToken,
    authenticateToken
}
