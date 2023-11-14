const multer = require('multer');
const { userCollection } = require('../schema/userSchema.js');
const { cabCollection } = require('../schema/cabSchema'); // Import your cab schema


// Set up multer for handling multipart form data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createUser = async (req, res) => {
  try {
    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload failed.' });
      }

      // Access form fields from req.body
      const { name, number, email, age } = req.body;
      console.log(name, number, age, email);

      if (!name || !number || !email || !age) {
        return res.status(400).json({ error: 'Required fields are missing.' });
      }

      const newUser = {
        name,
        number,
        email,
        age,
      };

      // The await keyword should be used inside an async function
      // Ensure the function where this code is used is async

      // Add the new user document to the 'users' collection
      userCollection.add(newUser).then((userRef) => {
        // Send a success response with the ID of the newly added user
        res.status(201).json({ message: 'User details posted to Firebase successfully', id: userRef.id });
      });
    });
  } catch (error) {
    console.error('Error posting user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Function to get details of a single cab by ID
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params; // Get the cab ID from the URL parameter

    // Use the ID to retrieve the cab details from the database
    const doc = await userCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the cab details as a JSON response
    res.json({ user: doc.data() });
  } catch (error) {
    console.error('Error getting user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Get the cab ID from the request parameters

    // Delete the cab document from the 'cabs' collection
    const userRef = userCollection.doc(userId);
    await userRef.delete();

    res.status(200).json({ message: 'user deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Controller function to find cab drivers by location
const findCabsByLocation = async (req, res) => {
  try {
    const { location } = req.body; // Get the location from the form data

    // Check if "location" is provided
    if (!location) {
      return res.status(400).json({ error: 'Location is missing in the form data.' });
    }

    // Query the database to find cab drivers with the provided location
    const querySnapshot = await cabCollection.where('location', '==', location).get();

    const cabDrivers = [];
    querySnapshot.forEach((doc) => {
      cabDrivers.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    res.json({ cabDrivers });
  } catch (error) {
    console.error('Error finding cab drivers by location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ...

// Function to update user details by ID
const updateUserDetails = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the request parameters
    const { name, number, email, age } = req.body; // Get updated details from the request body

    if (!name || !number || !email || !age) {
      return res.status(400).json({ error: 'Required fields are missing.' });
    }

    // Update the user document in the 'users' collection
    const userRef = userCollection.doc(userId);
    await userRef.update({
      name,
      number,
      email,
      age,
    });

    res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createUser, getUserDetails, deleteUser, findCabsByLocation, updateUserDetails };





