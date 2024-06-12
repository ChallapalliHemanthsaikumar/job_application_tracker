// popup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 

  // Initialize Firebase
 
// Firebase configuration object

  // Initialize Firebase
  
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  // Initialize Firestore
  const db = app.firestore();
  
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveButton').addEventListener('click', () => {
      let jobDetails = {
        title: document.getElementById('jobTitle').value,
        company: document.getElementById('companyName').value,
        description: document.getElementById('jobDescription').value
      };
  
      // Save job details to Firestore
      db.collection("jobApplications").add(jobDetails)
        .then((docRef) => {
          alert('Job details saved successfully!');
          // console.log("Document written with ID: ", docRef.id);
          // Clear the form for new entry
          document.getElementById('jobTitle').value = '';
          document.getElementById('companyName').value = '';
          document.getElementById('jobDescription').value = '';
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    });
  });
  