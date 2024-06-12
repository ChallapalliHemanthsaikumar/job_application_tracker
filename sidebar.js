
// import firebaseConfig from './config.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "./firebase/firebase-auth.js";
import { initializeApp } from "./firebase/firebase-app.js";
import { getFirestore ,collection, addDoc,doc, getDoc,Timestamp} from "./firebase/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {

    const loginSection = document.getElementById('loginSection');
    const jobForm = document.getElementById('jobForm');
    const loginButton = document.getElementById('loginButton');
    const userNameElement = document.getElementById('userName');
    loginButton.addEventListener('click', () => {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
       

        signInWithEmailAndPassword(auth,email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                user.getIdToken().then(idToken => {
                    chrome.runtime.sendMessage({ idToken: idToken });
                    showJobForm(user);
                });
            })
            .catch((error) => {
                console.error('Error logging in: ', error);
            });
    });

    function showJobForm(user) {

        getDoc(doc(db, 'users', user.uid))
            .then((doc) => {
                if (doc.exists()) {
                    const userData = doc.data();
                    
                    userNameElement.textContent = userData.username;
                    populateJobForm(userData);
                    loginSection.style.display = 'none';
                    jobForm.style.display = 'block';
                } else {
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });


        // db.collection('users').doc(user.uid).get()
        //     .then((doc) => {
        //         if (doc.exists) {
        //             const userData = doc.data();
        //             populateJobForm(userData);
        //             loginSection.style.display = 'none';
        //             jobForm.style.display = 'block';
        //         } else {
        //             console.log("No such document!");
        //         }
        //     })
        //     .catch((error) => {
        //         console.log("Error getting document:", error);
        //     });
    }

    function populateJobForm(userData) {
        const jobTitleSelect = document.getElementById('jobTitle');
        const roles = userData.roles
        roles.forEach(role => {
            let option = document.createElement('option');
            option.value = role;
            option.textContent = role;
            jobTitleSelect.appendChild(option);
        });
        if (roles.length > 0) {
            jobTitleSelect.value = roles[0];
        }


        
    }

    document.getElementById('saveButton').addEventListener('click', () => {
        // const timestamp = new Date();
        const timestamp = Timestamp.fromDate(new Date());
        const options = { 
            timeZone: 'America/New_York', // Replace with your time zone
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        };

        const today = new Date().toLocaleDateString('en-CA', options).replace(/\//g, '-');


        const date = today
        const url = window.location.ancestorOrigins[0];
        
        let sourceWebsite = "other";
        if (url.includes("linkedin.com")) {
            sourceWebsite = "LinkedIn";
        } else if (url.includes("dice.com")) {
            sourceWebsite = "Dice";
        } else if (url.includes("glassdoor.com")) {
            sourceWebsite = "Glassdoor";
        } else if (url.includes("monster.com")) {
            sourceWebsite = "Monster";
        }

        const jobDetails = {
            title: document.getElementById('jobTitle').value,
            company: document.getElementById('companyName').value,
            companyType: document.getElementById('companyType').value,
            jobType: document.getElementById('jobType').value,
            applyType: document.getElementById('applyType').value,
            timestamp: timestamp,
            date: date,
            sourceWebsite: sourceWebsite,
            username: userNameElement.textContent,  // Add username to the job details
            comments: document.getElementById('comments').value,
            status:'Applied'
        };
        const user = auth.currentUser;
        const userJobApplicationsRef = collection(db, 'users', user.uid, date);

        addDoc(userJobApplicationsRef, jobDetails)
        .then((docRef) => {
            alert('Job details saved successfully!');
            // console.log("Document written with ID: ", docRef.id);
            // Clear the form for new entry
            document.getElementById('companyName').value = '';
            document.getElementById('companyType').value = 'IT staffing';
            document.getElementById('jobType').value = 'full-time';
            document.getElementById('applyType').value = 'easy';
            document.getElementById('comments').value = " ";
            // document.getElementById('jobTitle').value = roles[0];  // Reset to the first role
        })
        .catch(error => {
            console.error('Error adding document: ', error);
        });
    });
});


