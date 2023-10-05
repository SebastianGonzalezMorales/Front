// push data to the firestore database

const admin = require('firebase-admin');

const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const data = require('./questions.json');

async function uploadData() {
  for (const doc of data) {
    await db.collection('questions').add(doc);
  }
}

uploadData();
