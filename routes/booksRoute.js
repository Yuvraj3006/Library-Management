const express = require("express");
const { handleAddBook, handleSearchBooks, handleBookUpdate, handleDeleteBook, handleBookList } = require("../controllers/booksController");
const {authenticateToken} = require('../middleware/user-auth')

const router = express.Router();


router.get('/',handleSearchBooks);
router.post('/create',authenticateToken ,handleAddBook);
router.put('/update/:id',authenticateToken,handleBookUpdate);
router.delete('/delete/:id',authenticateToken,handleDeleteBook);
router.get('/author',authenticateToken,handleBookList);




module.exports = router;