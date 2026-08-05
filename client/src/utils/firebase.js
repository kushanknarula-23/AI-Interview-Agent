// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{ getAuth ,GoogleAuthProvider} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-4ed51.firebaseapp.com",
  projectId: "interviewiq-4ed51",
  storageBucket: "interviewiq-4ed51.firebasestorage.app",
  messagingSenderId: "347624382049",
  appId: "1:347624382049:web:0bf9cdb83ecd2b5c10d420"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth,provider}