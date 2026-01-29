import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB38GfZPRmRNzr6Berk6vNR_-g6EZZbV10",
  authDomain: "clone-telegram-46e49.firebaseapp.com",
  databaseURL: "https://clone-telegram-46e49-default-rtdb.firebaseio.com",
  projectId: "clone-telegram-46e49",
  storageBucket: "clone-telegram-46e49.firebasestorage.app",
  messagingSenderId: "233867604613",
  appId: "1:233867604613:web:da8d853c4aef5621b82fec"
};

export const app = initializeApp(firebaseConfig);
