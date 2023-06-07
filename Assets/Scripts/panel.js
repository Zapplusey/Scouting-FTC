import { getDocsDatabase__ } from "./firebase_script.js";

const resultViewer = document.querySelectorAll("#user-table").item(0);
const headersHTML = `
<div class="row headers">
    <div class="h">name</div>
    <div class="h">password</div>
    <div class="h">position</div>
    <div class="h">Email</div>
    <div class="h">DELETE button</div>
    
</div>`;

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
    resultViewerHTML += `<div class="row">`;
    ["name", "password", "position", "email"].forEach(k => {
      resultViewerHTML += `<div class="item">${o_[k]}</div>`;
    });
    resultViewerHTML += `<div class="item">DELETE</div>`;
    resultViewerHTML = resultViewerHTML += `</div>`;
  });
  resultViewer.innerHTML = headersHTML + resultViewerHTML;
};

updateUserTable(["accounts"]);
console.log("paneling");
