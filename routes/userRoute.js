const express = require('express')
const { createUser, getUserDetails, deleteUser, findCabsByLocation, updateUserDetails } = require('../controller/userController')

const router = express.Router()
const multer = require('multer');


const upload = multer(); // Create a multer instance

router.post('/user',createUser)


router.get('/user/:id',getUserDetails)

router.delete('/user/:id',deleteUser)

// Route to find cab drivers by location
router.get('/cabs', findCabsByLocation);

// Route to update user details by ID
router.put('/user/:id', upload.none(), updateUserDetails);

module.exports=router