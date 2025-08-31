import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Sample doctors data for initialization
const sampleDoctors = [
  { name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', rating: 4.8, distance: '0.5 km', phone: '+1234567890', lat: 37.7749, lng: -122.4194 },
  { name: 'Dr. Michael Chen', specialty: 'Neurologist', rating: 4.9, distance: '1.2 km', phone: '+1234567891', lat: 37.7849, lng: -122.4094 },
  { name: 'Dr. Emily Davis', specialty: 'Dermatologist', rating: 4.7, distance: '2.1 km', phone: '+1234567892', lat: 37.7649, lng: -122.4294 },
  { name: 'Dr. Robert Wilson', specialty: 'Orthopedist', rating: 4.6, distance: '1.8 km', phone: '+1234567893', lat: 37.7949, lng: -122.3994 },
  { name: 'Dr. Lisa Thompson', specialty: 'Pulmonologist', rating: 4.8, distance: '2.5 km', phone: '+1234567894', lat: 37.7549, lng: -122.4394 }
];

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

// Function to initialize the database with sample doctors
export const initializeDoctors = async () => {
  try {
    const doctorsRef = collection(db, 'doctors');
    const existingDoctors = await getDocs(doctorsRef);
    
    // Only add sample doctors if the collection is empty
    if (existingDoctors.empty) {
      for (const doctor of sampleDoctors) {
        await addDoc(doctorsRef, doctor);
      }
      console.log('Sample doctors added to database');
    }
  } catch (error) {
    console.error('Error initializing doctors:', error);
  }
};

export default app;