// Import necessary modules
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { cabCollection } = require('../schema/cabSchema.js'); // Import your cab schema
const { storage } = require('../config.js'); // Import Firebase Storage from your config
const { admin } = require('../config.js'); // Import the 'admin' object

// Create a storage engine for multer
const storageEngine = multer.memoryStorage();
const upload = multer({ storage: storageEngine });


const postCabDetails = (req, res) => {
  upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'lisence', maxCount: 1 }])(req, res, async function (err) {
    try {
      if (err) {
        console.error('Error uploading files:', err);
        return res.status(400).json({ error: 'File upload failed' });
      }

      // Access form fields from req.body
      const { name, number, address, vehicleNo, gender, age, Lisence, active,location } = req.body;

      // Check if required fields are provided
      if (!name || !number || !address || !vehicleNo || !gender || active === undefined) {
        return res.status(400).json({ error: 'Required fields are missing.' });
      }

      // Get the uploaded files from memory (file objects are available under req.files)
      const photoFile = req.files['photo'][0];
      const lisenceFile = req.files['lisence'][0];

      // Define file paths in Firebase Storage
      const photoFilePath = `cabs/${name}-${Date.now()}-${photoFile.originalname}`;
      const lisenceFilePath = `cabs/${name}-${Date.now()}-${lisenceFile.originalname}`;

      // Upload image files to Firebase Storage
      const [photoUploadMetadata, lisenceUploadMetadata] = await Promise.all([
        storage.bucket().file(photoFilePath).save(photoFile.buffer, {
          metadata: { contentType: photoFile.mimetype },
        }),
        storage.bucket().file(lisenceFilePath).save(lisenceFile.buffer, {
          metadata: { contentType: lisenceFile.mimetype },
        }),
      ]);

      // Get the public URLs of the uploaded images
      const photoUrl = `https://storage.googleapis.com/${storage.bucket().name}/${photoFilePath}`;
      const lisenceUrl = `https://storage.googleapis.com/${storage.bucket().name}/${lisenceFilePath}`;

      // Create a new cab document using the schema with the image URLs and "active" field
      const newCab = {
        name,
        number,
        address,
        photo: photoUrl,
        vehicleNo,
        gender,
        age,
        location,
        Lisence: lisenceUrl,
        active: Boolean(active), // Convert "active" to a Boolean
      };

      // Add the new cab document to the 'cabs' collection
      const cabRef = await cabCollection.add(newCab);

      // Send a success response with the ID of the newly added cab
      res.status(201).json({ message: 'Cab details posted successfully', id: cabRef.id });
    } catch (error) {
      console.error('Error posting cab details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

// Function to get details of a single cab by ID
const getCabDetails = async (req, res) => {
  try {
    const { id } = req.params; // Get the cab ID from the URL parameter

    // Use the ID to retrieve the cab details from the database
    const doc = await cabCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Cab not found' });
    }

    // Send the cab details as a JSON response
    res.json({ cab: doc.data() });
  } catch (error) {
    console.error('Error getting cab details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteCab = async (req, res) => {
  try {
    const cabId = req.params.id; // Get the cab ID from the request parameters

    // Delete the cab document from the 'cabs' collection
    const cabRef = cabCollection.doc(cabId);
    await cabRef.delete();

    res.status(200).json({ message: 'Cab deleted successfully' });
  } catch (error) {
    console.error('Error deleting cab:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateCabActiveStatus = async (req, res) => {
  try {
    const { id } = req.params; // Get the cab ID from the URL parameter
    const { active } = req.body; // Get the new "active" value from the request body

    // Check if "active" is provided
    if (active === undefined) {
      return res.status(400).json({ error: 'Missing "active" field in the request body.' });
    }

    // Update the "active" field in the cab document in the database
    await cabCollection.doc(id).update({ active: Boolean(active) });

    res.json({ message: 'Cab active status updated successfully' });
  } catch (error) {
    console.error('Error updating cab active status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getAllCabDetails = async (req, res) => {
  try {
    const cabs = [];
    // Retrieve all cab documents from the 'cabs' collection
    const querySnapshot = await cabCollection.get();

    // Iterate through the documents and add them to the 'cabs' array
    querySnapshot.forEach((doc) => {
      cabs.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    res.json({ cabs });
  } catch (error) {
    console.error('Error getting all cab details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const updateCabLocation = async (req, res) => {
  try {
    const { id } = req.params; // Get the cab ID from the URL parameter
    const { location } = req.body; // Get the new preferred service location from the request body

    // Check if "location" is provided
    if (!location) {
      return res.status(400).json({ error: 'Missing "location" field in the request body.' });
    }

    // Update the "location" field in the cab document in the database
    await cabCollection.doc(id).update({ location });

    res.json({ message: 'Cab location updated successfully' });
  } catch (error) {
    console.error('Error updating cab location:', error);
    res.status(500).json({ error: 'Internal server error' });;
  }
};




module.exports = { postCabDetails,getCabDetails,deleteCab,updateCabActiveStatus,getAllCabDetails,updateCabLocation};

