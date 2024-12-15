const db = require("../database/database");
const bcrypt = require("bcrypt")
const {generateToken} =  require("../middleware/user-auth");

async function handleUserLogin(req, res) {
    const {useremail,userpassword,rememberMe} = req.body;
    //console.log(userpassword)
    try {
            if(!useremail || !userpassword){
                return res.status(400).send({message : "Enter all the fields correctly"});
            }

            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            const isValidEmail = emailRegex.test(useremail);
            if (!isValidEmail) {
                return res.status(400).send({ error: "Enter a valid email address" });
            }

            //console.log(useremail)
            const result = await db.promise().query(`SELECT * FROM users WHERE useremail = ?`,[useremail]);
            //console.log(result)
            const user = result[0];
            if(user.length === 0){
                return res.status(400).send({ message : "The user does not exist"});
            }
            //console.log(user[0]);
            const verify = await bcrypt.compare(userpassword,user[0].userpassword);
            if(!verify){
                return res.status(400).send({message : 'Invalid User'});
            }
            //console.log(user.useremail);      
            //console.log(user[0].userID);
            let token;
            if(rememberMe){
                const expiry = '30d';
                token = generateToken({username : user[0].username,useremail : user[0].useremail,userrole : user[0].role,userid : user[0].userID,expiry : expiry});
            }
            else{
                token = generateToken({username : user[0].username,useremail : user[0].useremail,userrole : user[0].role,userid : user[0].userID});
            }
            // res.cookie('auth_token',token,{httpOnly : true, maxAge : 3 * 24 * 60 * 60 * 1000});
           
            return res.status(200).send(token);
    } catch (error) {
        console.log(`error : ${error}`);
        return res.status(500).send({message : "Internal Server Error"});
    }
}

async function handleUserRegistration(req,res) {
    const {useremail,username, userpassword,userrole} = req.body;
    try {
        if(!username || !useremail || !userpassword || !userrole ){
            return res.status(400).send({message : "Enter all the fields"});
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const isValidEmail = emailRegex.test(useremail);
        if (!isValidEmail) {
            return res.status(400).send({ error: "Enter a valid email address" });
        }

        const passwordRegex = /^(?=(.*[A-Za-z]){6,})(?=(.*\d){4,})(?=(.*[\W_]){1,}).{11,}$/;
        const validPassword = passwordRegex.test(userpassword);
        if (!validPassword) {
            return res.status(400).send({ error: "The user password must contain at least 6 alphabets, 4 digits, and 1 special character." });
        }

        //console.log(useremail);
        const doesUserExist = await db.promise().query(`SELECT * FROM users WHERE useremail = ?`,[useremail]);
        const result = doesUserExist[0];
        if(result.length == 1){
            //console.log(doesUserExist);
            return res.status(400).send({ message : "The user already exists"});
        }

        const hashedPassword = await bcrypt.hash(userpassword,10);

        const userCreationQuery = `INSERT INTO users (username, useremail, userpassword,role) VALUES (?,?,?,?)`;
        const userCreationDetails = [username,useremail,hashedPassword,userrole];
        await db.promise().query(userCreationQuery,userCreationDetails);
        const ID = await db.promise().query(`SELECT userID FROM users WHERE useremail = ?`, [useremail]);
        const userid = ID[0];
        //console.log(userid);
        const token = generateToken({username : username,useremail : useremail,userrole : userrole,userid : userid[0].userID});
        
        //res.cookie('auth_token',token,{httpOnly : true, maxAge : 3 * 24 * 60 * 60 * 1000});
        return res.status(200).send(token);
    } catch (error) {
        console.log(`error : ${error}`);
        return res.status(500).send({ message : "Internal Server Error"});
    }
    
}

async function handleChangePassword(req,res) {
    const userid = req.params.id;
    const {username, password, useremail,userrole} = req.body;
    try {
        if(!username || !useremail || !password || !userrole ){
            return res.status(400).send({message : "Enter all the fields"});
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const isValidEmail = emailRegex.test(useremail);
        if (!isValidEmail) {
            return res.status(400).send({ error: "Enter a valid email address" });
        }

        const passwordRegex = /^(?=(.*[A-Za-z]){6,})(?=(.*\d){4,})(?=(.*[\W_]){1,}).{11,}$/;
        const validPassword = passwordRegex.test(password);
        if (!validPassword) {
            return res.status(400).send({ error: "The user password must contain at least 6 alphabets, 4 digits, and 1 special character." });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        userUpdation = `UPDATE users SET username = ? , useremail = ? , userpassword = ?, role = ? WHERE userid = ?`;
        userUpdationDetails = [username,useremail,hashedPassword,userid,userrole];
        await db.promise().query(userUpdation,userUpdationDetails);
        const token = generateToken({username : username,useremail : useremail,userrole : userrole});
        res.send(token);
        return res.status(200).send({ message : "Details uploaded successfully"});
        
    } catch (error) {
        console.log(`error : ${error}`);
        return res.status(500).send({ message : "Internal Server Error"});
    }
}

async function handleUserDelete(req,res) {
    const userid = req.params.id;
    try {
        const deleteQuery = `DELETE FROM users WHERE userid = ?`;
        const deleteQueryParams = [userid];
        await db.promise().query(deleteQuery,deleteQueryParams);

        return res.status(200).send({message : "Records deleted successfully"});
    } catch (error) {
        console.log(`error : ${error}`);
        return res.status(500).send({ message : "Internal Server Error"});
    }
}


async function handleUserLogout(req,res) {
    res.cookie('auth_token' , " ", {maxAge : 1});
    res.redirect("/");
}




module.exports = {
    handleUserLogin,handleUserRegistration, handleUserLogout,handleChangePassword, handleUserDelete
}