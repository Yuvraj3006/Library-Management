const express = require('express');
const { authenticateToken } = require('../middleware/user-auth');
const {handleBookBorrow, handleBookReturn, handleReaderBookList, handleReaderProfile, handleGetReaderProfile, handleUpdateUserProfile} = require('../controllers/readerController');

const router = express.Router();


router.post("/books/borrow",authenticateToken,handleBookBorrow);
router.post("/books/return",authenticateToken,handleBookReturn);
router.post("/profile",authenticateToken,handleReaderProfile);
router.get('/books',authenticateToken,handleReaderBookList);
router.get('/profile',authenticateToken,handleGetReaderProfile);
router.put('/profile',authenticateToken,handleUpdateUserProfile);

module.exports = router;