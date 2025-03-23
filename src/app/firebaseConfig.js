import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDHZOmC3wqbu6oTllK2QOCUyLo2J5ZnA_E",
  authDomain: "takeoffyachts-admin.firebaseapp.com",
  projectId: "takeoffyachts-admin",
  storageBucket: "takeoffyachts-admin.appspot.com",
  messagingSenderId: "450486805103",
  appId: "1:450486805103:web:9c9d1c5c5c5c5c5c5c5c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
