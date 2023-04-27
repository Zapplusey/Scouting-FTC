export function loadContent(url, selector) {
  // create an XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // set up a callback for when the request is complete
  xhr.onload = function () {
    // check for success
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        // parse the response as HTML
        const response = xhr.responseXML;
        markScripts(true);
        const wrapper = response.querySelectorAll(selector)[0];
        wrapper.innerHTML = document.body.innerHTML;
        const bodyImportedWrapper = document.body.querySelector(selector);
        if (bodyImportedWrapper != null && bodyImportedWrapper != undefined)
          if (bodyImportedWrapper.classList.contains("imported")) {
            console.log("IMPORTED");
            return;
          }
        const headInnerHTML = document.head.innerHTML + response.head.innerHTML;
        response.head.innerHTML = headInnerHTML;
        console.log("IMPORTS");
        wrapper.classList.add("imported");
        console.log(wrapper);
        // Opens a new document, writes the document, and finalizes (closes) the document...

        document.open();
        document.write(response.documentElement.innerHTML);
        document.close();
      } else {
        console.error("Request failed.  Returned status of " + xhr.status);
      }
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    // open the request and send it
    xhr.open("GET", url);
    xhr.responseType = "document";
    xhr.send();
  });
}

export function loadHTML(url, selector) {
  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.readyState == xhr.DONE && xhr.status == 200) {
      const wrapper = document.querySelector(selector);

      const response = xhr.responseXML;

      response.querySelectorAll("link").forEach(elem => {
        document.head.appendChild(elem);
        //   response.body.removeChild(elem);
      });
      wrapper.innerHTML = response.body.innerHTML;
      markScripts(true);
      response.querySelectorAll("script").forEach(s => {
        const newScript = document.createElement("script");
        newScript.textContent = s.textContent;

        for (let attrIndex = 0; attrIndex < s.attributes.length; attrIndex++) {
          if (s.attributes.item(attrIndex) !== null) {
            newScript.setAttribute(s.attributes.item(attrIndex).name, s.attributes.item(attrIndex).value);
          }
        }
        s.remove();
        wrapper.appendChild(newScript);
      });

      //   const docClone = document.documentElement.innerHTML;
      //     document.open();
      //     document.write(docClone);
      //     document.close();
      //   const DOMupdateEvent = new Event("DOMContentLoaded", {
      //     bubbles: true,
      //     cancelable: true,
      //   });
      //   document.dispatchEvent(DOMupdateEvent);
    }
  };

  xhr.open("GET", url);
  xhr.responseType = "document";
  xhr.send();
  console.log("UPDATING SCRIPTS!!!");
}

/***Marks/Removes all current scripts (that have already been ran / loaded) */
const markScripts = (removeScripts = false) => {
  document.querySelectorAll("script:not([data-executed])").forEach(s => {
    if (removeScripts) s.remove();
    else s.setAttribute("data-executed", "true");
  });
};
