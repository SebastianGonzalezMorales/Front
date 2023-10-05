// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA-E24DZHSCtadq2EmcWQL1efFflfff1lw',
  authDomain: 'healthapp-87ac2.firebaseapp.com',
  projectId: 'healthapp-87ac2',
  storageBucket: 'healthapp-87ac2.appspot.com',
  messagingSenderId: '162638644646',
  appId: '1:162638644646:web:95191a919ee54860bb7b67',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
