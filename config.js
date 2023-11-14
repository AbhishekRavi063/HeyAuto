const admin = require('firebase-admin')
const serviceAccount = require('./key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://ayeauto-1113e.appspot.com', // Replace with your database URL
});

const db = admin.firestore();
const storage = admin.storage();

module.exports = { db, storage, admin };
