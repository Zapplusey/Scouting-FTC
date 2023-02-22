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
import { getDoc__, getDocsData__ } from "./firebase_script.js";
// Declaring variables
const resultViewer = document.getElementById("result_viewer");
const defaultDir = ["formData"];
let mode = "forms";

const calculatePoleScore = (obj_) => {
  // Setting up variables
  let score = 0;
  const { autonomous: auto, teleop_endgame: drive, generalData: gd } = obj_;
  // Parking
  const autoParkDict = [2, 20]; // TODO: Continue parking scoring...
  if (gd[3].value == "true")
    score +=
      parseInt(gd[4].selectedIndex) == 0 ? autoParkDict[1] : autoParkDict[0];
  if (gd[6].value == "true") score += autoParkDict[0]; // Parking in terminal at the end of the game
  if (gd[5].value == "true") score += 10; // Beacon (element) capping
  if (gd[7].value == "true") score += 20; // Completing circuit
  console.log(score);
  // Cones
  const scoreDict = {
    terminal: 1,
    ground: 2,
    low: 3,
    mid: 4,
    high: 5,
  };

  [auto, drive].forEach((gameState) => {
    gameState.forEach((pole) => {
      score += parseInt(pole.value) * scoreDict[pole.label.toLowerCase()];
    });
  });
  console.log(score);
  return score;
};

async function updateViewer(
  collectionPathArray = defaultDir,
  changeMode = "forms"
) {
  if (!navigator.onLine) {
    resultViewer.innerHTML = "unable to reach database: offline! ✈";
    return;
  }
  if (changeMode == "false") return;
  resultViewer.innerHTML = "Loading...";
  let objs = await getDocsData__(collectionPathArray);
  objs.sort((obj1, obj2) => {
    // Name sorting algorithm
    let name1 = obj1.generalData[1].value.toLocaleLowerCase(),
      name2 = obj2.generalData[1].value.toLocaleLowerCase();
    if (name1 > name2) return 1;
    if (name1 < name2) return -1;
    return 0;
  });
  let resultViewerHTML = ""; // Setting to nothing

  if (changeMode == "forms") {
    resultViewer.classList.remove("scroll-y");
    resultViewer.classList.add("scroll-x");
    const { generalData: gd0 } = objs[0];
    gd0.forEach((e, i) => {
      resultViewerHTML += `<tr><td>${e.label}</td>`;

      objs.forEach((obj_) => {
        resultViewerHTML += `<td>${obj_.generalData[i].value}</td>`;
      });
      resultViewerHTML += `</tr>`;
    });
    resultViewerHTML += `<tr><td>autonomous | cones | teleop</td>`;
    objs.forEach((obj_) => {
      resultViewerHTML += `<td>`;
      const { autonomous: auto, teleop_endgame: drive } = obj_;
      [auto, drive].forEach((gameState, gi) => {
        resultViewerHTML += `<div style="display: grid; grid-template-rows: repeat(5, 1fr); place-items: center;"><div>${
          gi == 0 ? "auto" : "teleop&\nendgame"
        }</div>`; //TODO: use div and custom component poles-display
        gameState.forEach((pole, i) => {
          // let poleDisplay = document.createElement("poles-display");
          // poleDisplay.setManualDisplays(1);
          // // poleDisplay.setAttribute("displays", 1);
          // poleDisplay.setAttribute("title", pole.label);
          // poleDisplay.setAttribute("image", pole.image);
          // poleDisplay.setDisplay(0, pole.value);
          // poleDisplay.setChangable(true);
          // let tempWrapper = document.createElement("span");
          // tempWrapper.appendChild(poleDisplay);
          // console.log(tempWrapper.firstChild);

          if (i == gameState.length - 1) {
            // poleDisplay.setAttribute("style", "grid-column: span 2;");
          }
          resultViewerHTML += `<div>${pole.label}: ${pole.value}</div> `;
        });
        resultViewerHTML += `</div>`; //TODO: remove and use custom component
      });
      resultViewerHTML += `</td>`;
    });
    resultViewerHTML += `</tr>`;

    resultViewerHTML += `<tr><td>score (without penalties)</td>`;
    objs.forEach((obj_) => {
      const score = calculatePoleScore(obj_);

      resultViewerHTML += `<td>${score}</td>`;
    });
    resultViewerHTML += `</tr>`;
    resultViewer.innerHTML = resultViewerHTML;
  } else if (changeMode == "averages") {
    resultViewer.classList.add("scroll-y");
    resultViewer.classList.remove("scroll-x");
    let averageObjs = [];
    {
      let currentTeamName = objs[0].generalData[1].value,
        currentAverageScore = 0,
        firstNameIndex = 0;
      objs.forEach((o_, i) => {
        const tempName = o_.generalData[1].value;
        if (tempName != currentTeamName) {
          averageObjs.push({
            name: currentTeamName,
            score: currentAverageScore / (i - firstNameIndex),
          });
          // Resetting values
          currentTeamName = tempName;
          firstNameIndex = i;
          currentAverageScore = 0;
        }
        currentAverageScore += calculatePoleScore(o_);
      });
      averageObjs.push({
        name: currentTeamName,
        score: currentAverageScore / (objs.length - firstNameIndex),
      });
      averageObjs.sort((a, b) => {
        if (a.score > b.score) return -1;
        if (a.score < b.score) return 1;
        return 0;
      });
    }
    resultViewer.innerHTML = "";
    averageObjs.forEach((o_) => {
      const row = document.createElement("tr");
      const scoreCell = document.createElement("td");
      scoreCell.innerHTML = o_.score;
      const nameCell = document.createElement("td");
      nameCell.innerHTML = o_.name;
      row.appendChild(nameCell);
      row.appendChild(scoreCell);
      resultViewer.appendChild(row);
    });
  }
}

window.addEventListener("load", (eve) => {
  // Default loading
  updateViewer();
});
document.querySelectorAll("button.refresh").forEach((e) => {
  // button refreshes and mode changes
  e.addEventListener("click", (ev) => {
    updateViewer(defaultDir, e.getAttribute("data-result-view-mode"));
  });
});
