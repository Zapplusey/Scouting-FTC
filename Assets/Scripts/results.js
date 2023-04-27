import { getDoc__, getDocsData__, deleteDoc__, getDocsDatabase__ } from "./firebase_script.js";
// Declaring variables
const resultViewer = document.getElementById("result_viewer");
const defaultDir = ["formData"];
let mode = "forms";

const calculatePoleScore = obj_ => {
  // Setting up variables
  let score = 0;
  const { autonomous: auto, teleop_endgame: drive, generalData: gd } = obj_;
  // Parking
  const autoParkDict = [2, 20]; // TODO: Continue parking scoring...
  if (gd[3].value == "true") score += parseInt(gd[4].selectedIndex) == 0 ? autoParkDict[1] : autoParkDict[0];
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

  [auto, drive].forEach(gameState => {
    gameState.forEach(pole => {
      score += parseInt(pole.value) * scoreDict[pole.label.toLowerCase()];
    });
  });
  console.log(score);
  return score;
};

window.addEventListener("online", () => {
  location.reload();
});

async function updateViewer(collectionPathArray = defaultDir, changeMode = "forms") {
  // Checking for an internet connection.. :D
  if (!navigator.onLine) {
    resultViewer.innerHTML = "unable to reach database: offline! ✈";
    return;
  }
  if (changeMode == "false") return;
  resultViewer.innerHTML = "Loading...";
  let received = await getDocsDatabase__(collectionPathArray);
  let objs = received.data;
  const docsNames = received.docs;
  // Saves original index of the detected info-file
  objs.forEach((o_, i) => {
    o_.originalID = docsNames[i];
  });
  // Sorts files into alphabetic order of team names...
  objs.sort((obj1, obj2) => {
    // Name sorting algorithm
    let name1 = obj1.generalData[1].value.toLocaleLowerCase(),
      name2 = obj2.generalData[1].value.toLocaleLowerCase();
    if (name1 > name2) return 1;
    if (name1 < name2) return -1;
    return 0;
  });
  let resultViewerHTML = ""; // Setting to nothing
  // Normal ('forms') mode
  if (changeMode == "forms") {
    resultViewer.setAttribute("data-exclude-filtered", "0-2");
    resultViewer.classList.remove("scroll-y");
    resultViewer.classList.add("scroll-x");
    let propertyLabelIndex = 1;
    const { generalData: gd0 } = objs[0];
    gd0.forEach((e, i) => {
      resultViewerHTML += `<tr><td>(${propertyLabelIndex++}) ${e.label}</td>`;

      objs.forEach(obj_ => {
        resultViewerHTML += `<td>${obj_.generalData[i].value}</td>`;
      });
      resultViewerHTML += `</tr>`;
    });
    resultViewerHTML += `<tr><td>(${propertyLabelIndex++}) autonomous | cones | teleop</td>`;
    objs.forEach(obj_ => {
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

    resultViewerHTML += `<tr><td>(${propertyLabelIndex++}) score (without penalties)</td>`;
    objs.forEach(obj_ => {
      const score = calculatePoleScore(obj_);
      resultViewerHTML += `<td>${score}</td>`;
    });
    resultViewerHTML += `</tr>`;
    resultViewerHTML += `<tr>`;
    resultViewerHTML += `<td class="delete-column">DELETE DOCS DATA</td>`;
    objs.forEach(obj_ => {
      resultViewerHTML += `<td class="delete-column delete" data-column-id="${obj_.originalID}" >DELETE</td>`;
    });

    resultViewer.innerHTML = resultViewerHTML;
  } else if (changeMode == "averages") {
    // Changing resultViewer to match averages display...
    resultViewer.setAttribute("data-exclude-filtered", "0-1");
    resultViewer.classList.add("scroll-y");
    resultViewer.classList.remove("scroll-x");
    // Creating an object that will contain all results data...
    let averageObjs = [];
    const teamIndexes = [];
    {
      let currentTeamName = objs[0].generalData[1].value,
        firstNameIndex = 0;
      objs.forEach((o_, i) => {
        const tempName = o_.generalData[1].value;
        if (tempName != currentTeamName) {
          teamIndexes.push({
            min: firstNameIndex,
            max: i - 1,
          });
          // Resetting values
          currentTeamName = tempName;
          firstNameIndex = i;
        }
      });
      teamIndexes.push({
        min: firstNameIndex,
        max: objs.length - 1,
      });

      /**Data labels of data collections (objs) */
      const listings = [];
      /**Data types of data collections (objs) */
      const listingsTypes = [];
      console.log(objs[0].generalData);
      for (const property of objs[0].generalData) {
        listings.push(property.label);
        if (property.value == "false" || property.value == "true") listingsTypes.push("boolean");
        else listingsTypes.push("string");
      }
      const processStringData = (str_, listingIndex, prefix = "", indexDelta = 1) => {
        if (listingsTypes[listingIndex] == "string") {
          return ` ${prefix} ${str_}`;
        } else if (listingsTypes[listingIndex] == "boolean") {
          return str_ == "true" ? 100 / indexDelta : 0;
        }
      };
      teamIndexes.forEach(indexRange => {
        /**Average data for an index range (for the same team's data objects) */
        const averageDataObjs = { score: 0 };
        const polesAvg = {};
        objs[indexRange.min].autonomous.forEach(pole => {
          polesAvg[pole.label] = 0;
          averageDataObjs["junction-" + pole.label] = 0;
        });
        listings.forEach((label, labelIndex) => {
          if (listingsTypes[labelIndex] == "boolean") averageDataObjs[label] = 0;
          if (listingsTypes[labelIndex] == "string") averageDataObjs[label] = "";
        });

        // Adding other values...
        for (let currentDataObj = indexRange.min; currentDataObj <= indexRange.max; currentDataObj++) {
          const { generalData: gd, autonomous: auto, teleop_endgame: op_game } = objs[currentDataObj];
          // Adding generalData
          for (let propertyIndex = 2; propertyIndex < gd.length; propertyIndex++) {
            averageDataObjs[listings[propertyIndex]] += processStringData(
              gd[propertyIndex],
              propertyIndex,
              "||",
              indexRange.max - indexRange.min
            );
          }
          // Adding cones count
          Object.keys(polesAvg).forEach(key_ => {
            polesAvg[key_] = 0;
          });
          [...auto, ...op_game].forEach(pole => {
            polesAvg[pole.label] += parseInt(pole.value);
          });
          Object.keys(polesAvg).forEach(key => {
            averageDataObjs["junction-" + key] += polesAvg[key] / 2;
          });
          // Adding scores
          averageDataObjs["score"] += calculatePoleScore(objs[currentDataObj]);
        }
        console.log(averageDataObjs);
        averageObjs.push(averageDataObjs);
      });
    }

    resultViewer.innerHTML = "";
    const keyRow = document.createElement("tr");
    Object.keys(averageObjs[0]).forEach(key => {
      const keyCell = document.createElement("td");
      keyCell.innerText = key;
      keyRow.appendChild(keyCell);
    });
    resultViewer.appendChild(keyRow);
    averageObjs.forEach(o_ => {
      const row = document.createElement("tr");
      Object.values(o_).forEach(propertyValue => {
        const cell = document.createElement("td");
        cell.innerText = propertyValue;
        row.appendChild(cell);
      });
      resultViewer.appendChild(row);
    });
  }
  // Setting timeout to add listener to delete TDs
  window.setTimeout(() => {
    const deleteCells = resultViewer.querySelectorAll("td.delete-column.delete");
    deleteCells.forEach((cell, cellI) => {
      cell.addEventListener("click", eve => {
        const columnID = cell.getAttribute("data-column-id");
        deleteDoc__(["formData", columnID]);
        console.log("DELETED " + columnID);
        sessionStorage.setItem("DELETED:", columnID);
        // Deleting the represented row
        resultViewer.querySelectorAll("tr").forEach(tableRow => {
          tableRow
            .querySelectorAll("td")
            .item(cellI + 1)
            .remove();
        });
      });
    });
  }, 100);
}

window.addEventListener("load", eve => {
  // Default loading
  updateViewer();
});
document.querySelectorAll("button.refresh").forEach(e => {
  // button refreshes and mode changes
  e.addEventListener("click", ev => {
    updateViewer(defaultDir, e.getAttribute("data-result-view-mode"));
  });
});
