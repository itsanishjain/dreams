// import Firebase
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaNtBden977Y_wo06gpoySydVEhCC7lJY",
  authDomain: "ml-vision-9e63e.firebaseapp.com",
  databaseURL: "https://ml-vision-9e63e.firebaseio.com",
  projectId: "ml-vision-9e63e",
  storageBucket: "ml-vision-9e63e.appspot.com",
  messagingSenderId: "1049296131560",
  appId: "1:1049296131560:web:c473155040f8544f7ac05d",
  measurementId: "G-2C73M74S7N",
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const realTimeDb = getDatabase(app);

export default realTimeDb;
