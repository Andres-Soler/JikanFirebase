import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyCFsQllxxEzhmebd3cCPpF6q_NXRkz04r4",
  authDomain: "jikananimeapi.firebaseapp.com",
  projectId: "jikananimeapi",
  storageBucket: "jikananimeapi.firebasestorage.app",
  messagingSenderId: "1040313888244",
  appId: "1:1040313888244:web:4384bc42a8a82dca605da1",
  measurementId: "G-LR6X3ZYVZJ"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app); // ✅ ¡Esto es necesario!
export { auth, db };