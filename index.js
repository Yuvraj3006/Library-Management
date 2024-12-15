const express = require("express");
require('dotenv').config()


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));   

const UserRoute = require("./routes/userRoute");
const BooksRoute = require("./routes/booksRoute");
const ReaderRoute = require('./routes/readerRoute');

app.use('/users',UserRoute);
app.use('/books',BooksRoute);
app.use('/reader',ReaderRoute);

app.listen(process.env.PORT,(req,res) => {
    console.log(`Server running on port ${process.env.PORT}`);
}); 