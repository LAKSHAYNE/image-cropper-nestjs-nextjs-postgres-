import firebase from "firebase/compat/app";
import "firebase/compat/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCybTk9EC5xlvypm6kuddWGxkc9OFLHHNI",
  authDomain: "imageuploader-6670f.firebaseapp.com",
  projectId: "imageuploader-6670f",
  storageBucket: "imageuploader-6670f.appspot.com",
  messagingSenderId: "1024225777092",
  appId: "1:1024225777092:web:a46c4468ed7b626e578091",
};
firebase.initializeApp(firebaseConfig);
export const storage = firebase.storage();
