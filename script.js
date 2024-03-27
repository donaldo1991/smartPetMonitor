// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCu81tBZKu5BcCfyPPt-bm0h394PODwAmg",
  authDomain: "smart-pet-monitor-3efe8.firebaseapp.com",
  databaseURL: "https://smart-pet-monitor-3efe8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "smart-pet-monitor-3efe8",
  storageBucket: "smart-pet-monitor-3efe8.appspot.com",
  messagingSenderId: "641963666098",
  appId: "1:641963666098:web:89c21785472cc0d8e5f7ab"
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the file storage service
const storage = firebase.storage();
// Get a reference to the database service
const database = firebase.database();

// Create camera database reference
const camRef = database.ref("file");

console.log(storage);
console.log(database);
console.log(camRef);

// Function to fetch the latest image data from the database and update UI
function fetchLatestImageData() {
  camRef.limitToLast(1).once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        const image = childSnapshot.val()["image"];
        const time = childSnapshot.val()["timestamp"];
        const storageRef = storage.ref(image);

        storageRef.getDownloadURL()
          .then(function(url) {
            console.log(url);
            document.getElementById("photo").src = url;
            document.getElementById("time").innerText = time;
            sendEmail(url, "http://192.168.8.116:8000", time);
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    })
    .catch(function(error) {
      console.log(error);
    });
}

// Call the function initially to fetch the latest data
fetchLatestImageData();

// Set up a listener to handle subsequent updates in the database
camRef.limitToLast(1).on("child_added", function(childSnapshot) {
  const image = childSnapshot.val()["image"];
  const time = childSnapshot.val()["timestamp"];
  const storageRef = storage.ref(image);

  storageRef.getDownloadURL()
    .then(function(url) {
      console.log(url);
      document.getElementById("photo").src = url;
      document.getElementById("time").innerText = time;
      sendEmail(url, "https://woofwatch.ngrok.app/", time);
    })
    .catch(function(error) {
      console.log(error);
    });
});

// Function to send email
function sendEmail(url, url2, time) {
  emailjs.send("service_ucvo77n", "template_n6atl1t", {
    time: time,
    url: url,
    url2: url2
  }, "QB8DxBxQFHVazdYlg");
}

