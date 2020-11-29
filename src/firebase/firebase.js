import firebase from 'firebase';
import 'firebase/auth';
import '@firebase/firestore';
import 'firebase/storage';

class Firebase {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyD0IadqRBQgpPj4TDivU5Wdp8n1nu3ageQ",
        authDomain: "projectweb-46403.firebaseapp.com",
        databaseURL: "https://projectweb-46403.firebaseio.com",
        projectId: "projectweb-46403",
        storageBucket: "projectweb-46403.appspot.com",
        messagingSenderId: "395302133275",
        appId: "1:395302133275:web:dd4564a93440912f7f62be",
        measurementId: "G-GWVFEFBCRQ"
      });
    } else {
      console.log('firebase apps already running....');
    }
  }

  login = (email, password, success, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function (data) {
        success(data);
      })
      .catch(function (error) {
        reject(error);
      });
  }



  signOut = (success, reject) => {
    firebase.auth().signOut()
      .then(function () {
        success();
      })
      .catch(function (error) {
        reject(error);
      });
  }

  

  createUser = (email, password, success, reject) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function (data) {
        success(data);
      })
      .catch(function (error) {
        reject(error);
      });
  }

  addProfile(profile, success, reject) {
    profile.date = firebase.firestore.FieldValue.serverTimestamp();
    firebase.firestore().collection('Profile').add(profile)
      .then(function (docref) {
        success(docref);
      })
      .catch((error) => {
        reject(error);
      });
  }

  getProfile(uid, success, reject) {
    firebase.firestore().collection('Profile')
      .where('uid', '==', uid)
      .get()
      .then((querySnapshot) => {
        success(querySnapshot);
      })
      .catch((error) => {
        reject(error);
      });
  }

  getGoods = (success, reject) => {
    firebase.firestore().collection('Goods')
    .get()
    .then((querySnapshot) => {
      success(querySnapshot);
    })
    .catch((error) => {
      reject(error);
    });
  }

  updateProfile(profile, id, success, reject) {
    firebase.firestore().collection('Profile')
      .doc(id)
      .update(profile)
      .then(() => {
        success();
      })
      .catch((error) => {
        reject(error);
      });
  }

  addBill(bill, success,reject){
    bill.date = firebase.firestore.FieldValue.serverTimestamp();
    firebase.firestore().collection('Bill')
    .add(bill)
    .then((doc)=>{
      success(doc)
    })
    .catch((error)=>{
      reject(error)
    })
  }

  addPayment(payment,success,reject){
    payment.date = firebase.firestore.FieldValue.serverTimestamp();
    firebase.firestore().collection('Payment')
    .add(payment)
    .then((doc)=>{
      success(doc)
    })
    .catch((error)=>{
      reject(error)
    })
  }


  uplaodToFirebase = async (file, success, reject) => {
    var ref = await firebase
      .storage()
      .ref()
      .child('silp/'+file.lastModified);
    ref
      .put(file)
      .then(async (snapshot) => {
        await snapshot.ref.getDownloadURL().then((url) => {
          success(url);
        });
      })
      .catch((error) => {
        reject(error);
      });
  };








  resetUser = (email, success, reject) => {
    firebase.auth().sendPasswordResetEmail(email)
      .then(function () {
        success();
      })
      .catch(function (error) {
        reject(error);
      });
  }











}
const fire_base = new Firebase();
export default fire_base;
