const db = require('../database/database');

async function handleAddBook(req,res){
    const {bookName,bookGenre,bookStock} = req.body;
    try {
        const role = req.user.userrole;
        if(role == 'Reader') {
            return res.status(400).send('Only the Authors are allowed to add books');
        }
        
        //console.log(req.user.userid)
        const searchBook = `SELECT * FROM books WHERE booktitle = ?`;
        const searchBookDetails = [bookName];
        const result = await db.promise().query(searchBook,searchBookDetails);
        if(result[0].length !=  0){
            const book = result[0];
            //console.log(book)
            let stock = book[0].stock;
            //console.log(book[0].stock)
            stock += bookStock;
            const updateQuery = `UPDATE books SET stock = ? WHERE bookid = ?`;
            const updateQueryDetails = [stock,book[0].bookid];
            await db.promise().query(updateQuery,updateQueryDetails)
            return res.status(200).send({message : "Book added successfully"});
        }
        const addBook = `INSERT INTO books (booktitle,author,genre,stock,author_id) VALUES (?,?,?,?,?)`;
        const addBookDetails = [bookName,req.user.username,bookGenre,bookStock,req.user.userid];
        await db.promise().query(addBook,addBookDetails);
        return res.status(200).send({message : "Book added successfully"});
        
    } catch (error) {
        console.log(`error : ${error}`);
        return res.status(500).send({ message : "Internal Server Error"});   
    }
}

async function handleSearchBooks(req,res) {
    const {bookName,bookGenre,bookAuthor} = req.query;
    //console.log(bookName,bookGenre,bookAuthor)
    
    try {
        let query = `SELECT * FROM books WHERE 1=1`;
        let params = []
        if(bookName){
            query += ` AND booktitle = ?`;
            params.push(bookName)
        }

        if(bookGenre){
            query += ` AND genre = ?`
            params.push(bookGenre)
        }

        if(bookAuthor){
            query += ` AND author = ?`
            params.push(bookAuthor)
        }

        const result = await db.promise().query(query,params);
        //console.log(result)
        const books = result[0];
        return res.status(200).send(books);

    } catch (error) {
        console.log(`error : ${error}`);
        return res.status(500).send({ message : "Internal Server Error"});
    }
    
}

async function handleBookList(req, res) {
    const role = req.user.userrole; // Extract the user role from the token
    const userId = req.user.userid; // Assuming `id` is part of the token payload
    try {
        // Restrict access to non-author users
        if (role !== 'Author') {
            return res.status(403).send({ message: "Access Denied. Only accessible to Authors" });
        }

        // Query to get all books created by the logged-in author
        const [authorBooks] = await db.promise().query(
            `SELECT bookid, booktitle, genre, stock FROM books WHERE author_id = ?`,
            [userId]
        );

        // If no books found    
        if (authorBooks.length === 0) {
            return res.status(200).send({ message: "No books created by this author" });
        }

        // Query to get the list of currently borrowed books
        const [borrowedBooks] = await db.promise().query(
            `SELECT rb.reader_id, u.username AS reader_name, rb.book_id, b.booktitle
             FROM reader_book_map rb
             JOIN users u ON rb.reader_id = u.userID
             JOIN books b ON rb.book_id = b.bookid
             WHERE b.author_id = ?`,
            [userId]
        );

        // Return both the books created by the author and the currently borrowed books
        return res.status(200).send({
            createdBooks: authorBooks,
            borrowedBooks
        });

    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}


async function handleBookUpdate(req,res) {
    const {bookTitle, bookGenre} = req.body;
    const bookid = req.params;
    try {
        let query = `UPDATE books SET`
        let params = [];

        let used = false;
        if(bookTitle){
            used = true;
            query += ` booktitle = ?`;
            params.push(bookTitle);
        }

        if(bookGenre){
            if(used){
                query += ` ,`
            }
            query += ` genre = ?`
            params.push(bookGenre)
        }

        query +=  ` WHERE bookid = ?`;
        params.push(bookid.id);
        console.log("Final Query:", query);
        console.log(params);
        await db.promise().query(query,params);

        return res.status(200).send({message : "Book details edited successfully"});
    } catch (error) {
        console.log(`error : ${error}`);
        return res.status(500).send({ message : "Internal Server Error"});
    }
    
}

async function handleDeleteBook(req,res) {
    const bookid  = req.params.id;
    try {
        if(!bookid){
            return res.status(400).send({message : "Please Specify the book to be deleted"});
        }
        if(req.user.userrole == 'Reader'){
            return res.status(400).send({message : "Only Authors are allowed to deleted books."});
        }
        const checkQuery = `SELECT * FROM books WHERE bookid = ?`
        const result = await db.promise().query(checkQuery,[bookid]);
        const book = result[0];
        if(book.length == 0 ){
            return res.status(400).send({message : "Book doesnot exist in the system"});
        }
        const deleteQuery = `DELETE FROM books WHERE bookid = ?`;
        await db.promise().query(deleteQuery,[bookid]);
        return res.status(200).send({message : "Book details deleted successfully"});
    } catch (error) {
        console.log(`error : ${error}`);
        return res.status(500).send({ message : "Internal Server Error"});
    }
}

module.exports = {handleAddBook,handleSearchBooks,handleBookList,handleBookUpdate,handleDeleteBook};