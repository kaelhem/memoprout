import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/database'
import { createFirestoreInstance } from 'redux-firestore'

// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAyPy7hnJnK5U661cdKepDhx4i3t7snzVY",
  authDomain: "memoprout-pad-connect.firebaseapp.com",
  databaseURL: "https://memoprout-pad-connect.firebaseio.com",
  projectId: "memoprout-pad-connect",
  storageBucket: "memoprout-pad-connect.appspot.com",
  messagingSenderId: "1086357291933",
  appId: "1:1086357291933:web:0640cac31a7e83d98f6574",
  measurementId: "G-G4QR1ZQN1D"
}

// react-redux-firebase config
const config = {
  userProfile: 'users'
}

// Initialize firebase instance
const init = ({ dispatch }) => {
  firebase.initializeApp(firebaseConfig)
  firebase.firestore()
  return {
    firebase,
    config,
    dispatch,
    createFirestoreInstance
  }
}

export default init