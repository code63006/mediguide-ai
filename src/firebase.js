import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB77Nqp0VM9xlnqt-Mza9QEG_uTe4guCf8",
  authDomain: "apps-bf804.firebaseapp.com",
  projectId: "apps-bf804",
  storageBucket: "apps-bf804.firebasestorage.app",
  messagingSenderId: "878604346635",
  appId: "1:878604346635:web:f159fc60281e8cbb4e2e0e",
  measurementId: "G-SGTWC42LVJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;