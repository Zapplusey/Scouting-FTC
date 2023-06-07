import { getDoc__, getDocsDatabase__, writeDoc__ } from "./firebase_script.js";
import { deleteUser } from "./userform.js";
import { positionValues, valuesPosition } from "./userform.js";

const resultViewer = document.querySelectorAll("#user-table").item(0);
const headersHTML = `
<div class="row headers">
    <div class="h">name</div>
    <div class="h">password</div>
    <div class="h">position</div>
    <div class="h">Email</div>
    <div class="h">DELETE button</div>
    
</div>`;
let usernameChange = "";
let positionChange = "";
const updateUserTable = async collectionPathArray => {
  if (!navigator.onLine) {
    resultViewer.innerHTML = "unable to reach database: offline! ✈";
    return;
  }
  resultViewer.innerHTML =
    headersHTML +
    `
        <div class="row">
        <div class="item">loading...</div>
        </div>`;
  let received = await getDocsDatabase__(collectionPathArray);
  const objs = received.data;
  const docsNames = received.docs;

  let resultViewerHTML = "";
  objs.forEach((o_, i) => {
    resultViewerHTML += `<div class="row filterable">`;
    ["name", "password", "position", "email"].forEach(k => {
      resultViewerHTML += `<div class="item ${k}" data-username="${o_["name"]}">${o_[k]}</div>`;
    });
    resultViewerHTML += `<div class="item button delete" data-username="${o_["name"]}">DELETE</div>`;
    resultViewerHTML = resultViewerHTML += `</div>`;
  });
  resultViewer.innerHTML = headersHTML + resultViewerHTML;
  // Adds inner event listeners
  window.setTimeout(() => {
    const deleteButtons = resultViewer.querySelectorAll(".delete.button");
    deleteButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        let username = btn.getAttribute("data-username");
        deleteUser(username);
      });
    });
    const changePosLog = document.querySelector("#changePos");
    resultViewer.querySelectorAll(".item.position").forEach(posBTN => {
      posBTN.addEventListener("click", () => {
        usernameChange = posBTN.getAttribute("data-username");
        positionChange = posBTN.textContent;
        changePosLog.classList.add("appear");
        console.log("appear");
      });
    });

    const btnPromote = changePosLog.querySelector(".promote"),
      btnDemote = changePosLog.querySelector(".demote"),
      btnExit = changePosLog.querySelector(".exit");

    btnPromote.addEventListener("click", async () => {
      changePosLog.classList.remove("appear");
      if (positionValues[positionChange] >= 3) return;
      let docData = await getDoc__(["accounts", usernameChange]);
      docData.position = valuesPosition[positionValues[positionChange] + 1];
      writeDoc__(["accounts", usernameChange], docData);
      updateUserTable(["accounts"]);
    });
    btnDemote.addEventListener("click", async () => {
      changePosLog.classList.remove("appear");
      if (positionValues[positionChange] <= 1) return;
      let docData = await getDoc__(["accounts", usernameChange]);
      docData.position = valuesPosition[positionValues[positionChange] - 1];
      writeDoc__(["accounts", usernameChange], docData);
      updateUserTable(["accounts"]);
    });
    btnExit.addEventListener("click", () => {
      changePosLog.classList.remove("appear");
    });
  }, 100);
};

updateUserTable(["accounts"]);
console.log("paneling");
// Sets up filtering
window.setTimeout(() => {
  const filterWrapper = document.querySelector(".filter-wrapper");
  const filterInput = filterWrapper.querySelector("input");
  const dataHeaders = { name: 0, password: 1, position: 2, email: 3 };
  filterInput.addEventListener("input", eve => {
    const filterText = eve.target.value;
    if (!filterText.includes(":")) {
      resultViewer.querySelectorAll(".row.filterable").forEach(row => row.classList.remove("filtered"));
      return;
    }
    let filterSplit = [];
    let hasAnd = filterText.includes(" & "),
      hasOr = filterText.includes(" / ");

    if (hasAnd) {
      filterSplit = filterText.split(" & ");
      const filterArray1 = filterSplit[0].split(":");
      if (filterSplit[1].includes(":")) {
        const filterArray2 = filterSplit[1].split(":");
        filterByRow(
          true,
          dataHeaders[filterArray1[0]],
          filterArray1[1].trim(),
          dataHeaders[filterArray2[0]],
          filterArray2[1].trim()
        );
      }
    } else if (hasOr) {
      filterSplit = filterText.split(" / ");
      const filterArray1 = filterSplit[0].split(":");
      if (filterSplit[1].includes(":")) {
        const filterArray2 = filterSplit[1].split(":");
        filterByRow(
          false,
          dataHeaders[filterArray1[0]],
          filterArray1[1].trim(),
          dataHeaders[filterArray2[0]],
          filterArray2[1].trim()
        );
      }
    }
    if (!(hasAnd || hasOr)) {
      const filterArray = filterText.split(":");
      filterByRow(true, dataHeaders[filterArray[0]], filterArray[1].trim(), 0, "");
    }
  });
}, 200);

const filterByRow = (filterOrKeep, column1, value1, column2, value2) => {
  if (filterOrKeep) {
    // And
    resultViewer.querySelectorAll(".row.filterable").forEach(r => {
      if (
        r.querySelectorAll("*").item(column1).textContent.includes(value1) &&
        r.querySelectorAll("*").item(column2).textContent.includes(value2)
      ) {
        r.classList.remove("filtered");
      } else {
        r.classList.add("filtered");
      }
    });
  } else {
    // Or
    resultViewer.querySelectorAll(".row.filterable").forEach(r => {
      if (
        r.querySelectorAll("*").item(column1).textContent.includes(value1) ||
        r.querySelectorAll("*").item(column2).textContent.includes(value2)
      ) {
        r.classList.remove("filtered");
      } else {
        r.classList.add("filtered");
      }
    });
  }
};
