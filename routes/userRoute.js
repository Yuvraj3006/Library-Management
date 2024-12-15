const express = require('express');
const { handleUserRegistration,handleUserLogin,handleUserLogout, handleChangePassword, handleUserDelete } = require('../controllers/userController');

const router = express.Router();

router.post('/signup',handleUserRegistration);

router.post('/login',handleUserLogin);

router.post('/logout',handleUserLogout)

router.put('/update/:id',handleChangePassword);

router.delete('/delete/:id',handleUserDelete);

module.exports = router;