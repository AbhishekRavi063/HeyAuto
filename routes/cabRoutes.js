const express = require('express');
const { postCabDetails, getCabDetails,  deleteCab, updateCabActiveStatus, getAllCabDetails, updateCabLocation } = require('../controller/cabController');

const router = express.Router();

router.post('/cab',postCabDetails)

// Route to get details of a single cab by ID
router.get('/cab/:id', getCabDetails);

//
router.get('/cab',getAllCabDetails);;

// Delete a cab by ID
router.delete('/cab/:id', deleteCab);

router.patch('/cab/:id',updateCabActiveStatus)


// Route to update the preferred service location of a cab driver by ID
router.patch('/cab/:id/location', updateCabLocation);;


module.exports = router;