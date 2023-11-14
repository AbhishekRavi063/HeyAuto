const express = require('express')
const { createUser, getUserDetails, deleteUser, findCabsByLocation } = require('../controller/userController')

const router = express.Router()

router.post('/user',createUser)


router.get('/user/:id',getUserDetails)

router.delete('/user/:id',deleteUser)

// Route to find cab drivers by location
router.get('/cabs', findCabsByLocation);;

module.exports=router