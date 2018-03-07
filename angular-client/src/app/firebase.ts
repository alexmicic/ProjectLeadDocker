import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyAID3t1eVhVpPFHw-giJGLWs96IH6_5xMA",
  authDomain: "projectlead-91c3e.firebaseapp.com",
  databaseURL: "https://projectlead-91c3e.firebaseio.com",
  projectId: "projectlead-91c3e",
  storageBucket: "projectlead-91c3e.appspot.com",
  messagingSenderId: "110207522203"
};

firebase.initializeApp(config);

export default firebase;
