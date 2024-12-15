const db = require('../database/database');

async function handleBookBorrow(req,res) {
    const {bookName} = req.body;
    const readerId = req.user.userid;
    try {
        
        const query = await db.promise().query(`SELECT bookid,stock FROM books where booktitle = ?`,[bookName]);
        const queryResult = query[0];
        const bookID = queryResult[0].bookid;
        let stock = queryResult[0].stock;
        if(stock == 0){
            return res.status(400).send({message : "The book is currently out of stock"});
        }

        const booksBorrowed = await db.promise().query(`SELECT * FROM reader_book_map WHERE reader_id = ?`,[readerId]);
        const result = booksBorrowed[0];
       
        if(result.length == 5){
            return res.status(400).send({message : "You cannot borrow more than 5 books at a time"});
        }
        stock = stock - 1;
        //console.log(stock,readerId,bookID)
        await db.promise().query(`UPDATE books SET stock = ? WHERE bookid = ?`,[stock,bookID]);

        await db.promise().query('INSERT INTO reader_book_map VALUES (?,?)',[readerId,bookID]);
        return res.status(200).send({message : "Book has been alloted successfully"});
    } catch (error) {
        console.log(`error : ${error}`);
        return res.status(500).send({ message : "Internal Server Error"});
    }
}

async function handleBookReturn(req,res) {
    const {bookName} = req.body;
    try { 
        const query = await db.promise().query(`SELECT bookid,stock FROM books WHERE booktitle = ?`,[bookName]);
        const queryResult = query[0];
        const bookID = queryResult[0].bookid;
        let stock = queryResult[0].stock; 

        await db.promise().query(`DELETE FROM reader_book_map WHERE book_id = ?`,[bookID]);
        stock += 1;
       
        await db.promise().query(`UPDATE books SET stock = ? WHERE bookid = ?`,[stock,bookID]);
        return res.status(200).send({message : "Book has been returned successfully"});
    } catch (error) {
        console.log(`error : ${error}`);
        return res.status(500).send({ message : "Internal Server Error"});
    }
}
async function handleReaderBookList(req,res) {
    const readerID = req.user.userid;
    try {
        const [queryResult] = await db.promise().query(`SELECT book_id FROM reader_book_map WHERE reader_id = ?`, [readerID]);

     
        const bookIDList = queryResult.map(row => row.book_id);
    
        if (bookIDList.length === 0) {
            return res.status(200).send({ message: "No books borrowed" });
        }
    
        
        const placeholders = bookIDList.map(() => "?").join(",");
        const bookNameQuery = await db.promise().query(
            `SELECT bookid, booktitle, genre FROM books WHERE bookid IN (${placeholders})`,
            bookIDList
        );
    
        const [readerBook] = bookNameQuery;
    
        
        return res.status(200).send({ 'Books Borrowed': readerBook });
    
    } catch (error) {
        console.log(`error : ${error}`);
        return res.status(500).send({ message : "Internal Server Error"});
    }

}

async function handleReaderProfile(req,res) {
    const {contact, favorite_book,favorite_genre} =  req.body;
    const user = req.user;
    try {

        if(user.userrole == 'Author'){
            return res.status(400).send({message : 'Only Reader Profile can be created'});
        }
        const profileQuery = `INSERT INTO reader_profile (reader_id,contact,reader_email,reader_name,favorite_genre,favorite_book) VALUES (?,?,?,?,?,?)`
        const profileParams = [user.userid,contact,user.email,user.username,favorite_genre,favorite_book];
        await db.promise().query(profileQuery,profileParams);
        return res.status(200).send({message : 'Profile Created Successfully'});

    } catch (error) {
        console.log(`error : ${error}`);
        return res.status(500).send({ message : "Internal Server Error"});
    }
    
}

async function handleGetReaderProfile(req,res) {
    
    const user = req.user.userid;
    
    try {

        if(user.userrole == 'Author'){
            return res.status(400).send({message : 'Only Reader Profile can be created'});
        }
        const profileQuery =   `SELECT * FROM reader_profile WHERE reader_id = ?`;
        const profileParams = [user];
        const result =  await db.promise().query(profileQuery,profileParams);
        const profile = result[0];
        console.log(profile)
        return res.status(200).send({"User Profile" : profile});

    } catch (error) {
        console.log(`error : ${error}`);
        return res.status(500).send({ message : "Internal Server Error"});
    }
    
}

async function handleUpdateUserProfile(req,res) {
    const userid = req.user.userid;
    const {favorite_book,favorite_genre,contact} = req.body;
    try {
        let query = `UPDATE reader_profile SET`;
        let params = []
        let added = false;
        if(favorite_book){
            added = true;
            query += ` favorite_book = ?`;
            params.push(favorite_book);
        }
        if(favorite_genre){
            if(added){
                query += ` ,`
            }
            query += ` favorite_genre = ?`;
            params.push(favorite_genre);
            added = true;
        }
        if(contact){
            if(added){
                query += ` ,`
            }
            query += ` contact = ?`;
            params.push(contact);
        }

        query += ` WHERE reader_id = ?`;
        params.push(userid);
        
        await db.promise().query(query,params);
        return res.status(200).send({message : 'Reader profile updated'});

    } catch (error) {
        console.log(`error : ${error}`);
        return res.status(500).send({ message : "Internal Server Error"});
    }
    
}


module.exports = {handleBookBorrow,
                handleBookReturn,
                handleReaderBookList,
                handleReaderProfile,
                handleGetReaderProfile,
                handleUpdateUserProfile};