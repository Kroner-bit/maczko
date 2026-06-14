import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

// Read Firebase config from environment or use proxy?
// Since we don't have the api keys here directly unless we import them from the frontend config...
