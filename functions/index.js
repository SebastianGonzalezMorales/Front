const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const database = admin.firestore();

exports.updateToPending = functions.pubsub
  .schedule('0 0 * * *')
  .onRun((context) => {
    console.log('Starting...');
    database
      .collectionGroup('medication')
      .get()
      .then((medSnapshot) => {
        medSnapshot.forEach((medDoc) =>
          medDoc.ref.update({ status: 'Pending' })
        );
      });
  });
