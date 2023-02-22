// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  updateDoc,
  deleteDoc,
  deleteField,
  getDocs,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAx3yqOSfyTrKJYQ10Tq73UtIQmusj3z1k",
  authDomain: "scounting16473.firebaseapp.com",
  projectId: "scounting16473",
  storageBucket: "scounting16473.appspot.com",
  messagingSenderId: "899338740838",
  appId: "1:899338740838:web:f32c8ab117e28fe039b9a7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const dataCollectionPath = ["formData"];

// works, tested
export async function writeDoc__(collectionName, o_ = {}, id_ = "NONE") {
  const docRef = await setDoc(doc(db, `${collectionName}/${id}`), o_)
    .then(() => {
      console.log("Data set successfully");
    })
    .catch((error) => {
      console.log("Operation failed; error: " + error);
    });
}

export async function writeDocPath__(collectionNames = [], o_ = {}) {
  var docPath = "";
  for (let i = 0; i < collectionNames.length; i++) {
    docPath += collectionNames[i] + "/";
  }
  docPath = docPath.substring(0, docPath.length - 1);
  // console.log(docPath);
  const docRef = await setDoc(doc(db, docPath), o_)
    .then(() => {
      console.log("Data set successfully");
    })
    .catch((error) => {
      console.log("Operation failed; error: " + error);
    });
}

export async function getJsonData(path = "") {
  let data = {};
  if (path == "") return data;
  fetch(path)
    .then((respone) => respone.json())
    .then((collectedData) => (data = collectedData))
    .catch((err) => console.error(err));
  return data;
}

export async function addDoc__(collectionPathArray = [], o_ = {}) {
  const docRef = await addDoc(
    collection(db, arrayToPath(collectionPathArray)),
    o_
  );
  return docRef;
}

// works, tested
// async function getDocRef__(collectionName) {
//   if (collectionName.length % 2 == 0) {
//     let docRef = doc(db, collectionName[0], collectionName[1]);
//     for (let index = 2; index < collectionName.length; index += 2) {
//       docRef = await doc(docRef, collectionName[index], collectionName[index + 1]);
//     }
//     return docRef;
//   } else if (collectionName.length % 2 == 1) {
//     let docRef = doc(db);
//     for (let index = 0; index < collectionName.length - 1; index += 2) {
//       docRef = await doc(docRef, collectionName[index], collectionName[index + 1]);
//     }
//     const querySnapshot = await getDocs(collection(docRef, collectionName[collectionName.length - 1]));
//     return querySnapshot;
//   }
// }

export function arrayToPath(arr__) {
  var pathStr = "";
  for (let i = 0; i < arr__.length; i++) {
    pathStr += arr__[i] + "/";
  }
  pathStr = pathStr.substring(0, pathStr.length - 1);
  return pathStr;
}

// works, tested;

export async function getDoc__(docPathArray) {
  const docSnap = await getDoc(doc(db, arrayToPath(docPathArray)));
  if (docSnap.exists()) {
    console.log("transmitting data");
    return docSnap.data();
  } else {
    console.log("File not found.");
  }
}

export async function getDocs__(collectionPathArray = []) {
  if (collectionPathArray.length % 2 == 0) {
    console.error("There must be an odd number of path directories (getDocs).");
    return null;
  }
  const docsSnap = await getDocs(
    collection(db, arrayToPath(collectionPathArray))
  );
  console.log("collected data successfully");
  return docsSnap;
}

export async function getDocsData__(collectionPathArray = []) {
  let dataArr_ = [];
  if (collectionPathArray.length % 2 == 0) {
    console.error("There must be an odd number of path directories (getDocs).");
    return null;
  }
  const docsSnap = await getDocs(
    collection(db, arrayToPath(collectionPathArray))
  );
  docsSnap.forEach((doc) => {
    dataArr_.push(doc.data());
  });
  console.log("collected data successfully");
  // console.log(dataArr_);
  return dataArr_;
}

// hasn't been tested yet
export async function deleteDocs__(collectionName, id_) {
  try {
    await deleteDoc(doc(db, collectionName, id_));
  } catch (error) {
    console.log(error);
    return;
  }
  console.log("Successfully deleted: " + id_);
}

const inputsToValues = (lst) => {
  let values = [];
  lst.forEach((e, i) => {
    let currentValue = lst[i].value;
    let currentType = lst[i].getAttribute("type");
    if (currentValue == null || currentValue == undefined) {
      switch (currentType) {
        case "number":
          currentValue = "0";
          break;
        case "checkbox":
          currentValue = "off";
          break;
        default:
          currentValue = "";
          break;
      }
    }
    values.push({
      value: currentValue,
      index: parseInt(lst[i].getAttribute("data-input-index")),
      label: lst[i].getAttribute("data-tag"),
      hebrewLabel: lst[i].getAttribute("placeholder"),
      type: currentType,
    });
  });
  console.log(values);
  return { properties: values };
};
const gatherInfo = (isManual = true, lst = []) => {
  let infoObj = {};
  if (isManual) {
    const conesPoles = document.querySelectorAll("form .pole-display-wrapper");
    conesPoles.forEach((cp, i) => {
      const gameState = i == 0 ? "autonomous" : "teleop_endgame";
      infoObj[gameState] = [];
      cp.querySelectorAll("poles-display").forEach((pole, i) => {
        infoObj[gameState][i] = {
          label: pole.getTitle(),
          value: pole.getValue(),
          image: pole.getAttribute("image"),
        };
      });
    });
    const dataElements = document.querySelectorAll("form > .info.input");
    const dataLoc = "generalData";
    infoObj[dataLoc] = [];
    dataElements.forEach((e, i) => {
      infoObj[dataLoc][i] = {
        label: e.getAttribute("data-tag"),
        value: e.value,
      };
      if (e.tagName.toLowerCase() == "switch-display") {
        infoObj[dataLoc][i]["selectedIndex"] = e.selectedIndex;
        console.log("adding selected index of display: ", e.selectedIndex);
        // TODO does this shit work...?
      }
    });
  } else infoObj = inputsToValues(lst);
  console.log(infoObj);
  return infoObj;
};

const submitValues = (eve) => {
  const inputs = gatherInfo();
  // inputs.sort((a,b) => a.index - b.index);
  addListOfData(inputs);
  alert("Form Submitted! טופס הוגש");
  window.setTimeout((eve) => {
    location.reload();
  }, 100 * 12);
};

const submitButton = document.querySelector("button#sub");
submitButton.addEventListener("click", submitValues);

const addListOfData = (lst) => {
  addDoc__(["formData"], lst);
};
