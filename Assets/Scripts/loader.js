export function loadContent(url, selector) {
  // create an XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // set up a callback for when the request is complete
  xhr.onload = function () {
    // check for success
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        if (document.querySelector("script[data-executed]") != null) return;
        // parse the response as HTML
        const response = xhr.responseXML;
        // remakeScripts(document.head.querySelectorAll("script"));
        const wrapper = response.querySelectorAll(selector).item(0);
        // wrapper.innerHTML = document.body.innerHTML;
        document.querySelectorAll("body > *").forEach(elem => {
          elem.remove();
          // const elemCopy = ;
          if (elem.tagName != "SCRIPT") {
            wrapper.appendChild(elem.cloneNode(true));
          } else {
            const newScript = document.createElement("script");
            newScript.textContent = elem.textContent;
            for (let attrIndex = 0; attrIndex < elem.attributes.length; attrIndex++) {
              const elemAttr = elem.attributes.item(attrIndex);
              if (elemAttr != null) {
                newScript.setAttribute(elemAttr.name, elemAttr.value);
              }
            }
            document.body.appendChild(newScript);
          }
        });

        response.querySelectorAll("body > *").forEach(elem => {
          elem.remove();
          if (elem.tagName != "SCRIPT") {
            // TODO IN HERE
            document.body.appendChild(elem.cloneNode(true));
          } else {
            const newScript = document.createElement("script");
            newScript.textContent = elem.textContent;
            for (let attrIndex = 0; attrIndex < elem.attributes.length; attrIndex++) {
              const elemAttr = elem.attributes.item(attrIndex);
              if (elemAttr != null) {
                newScript.setAttribute(elemAttr.name, elemAttr.value);
              }
            }
            document.body.appendChild(newScript);
          }
        });
        response.head.querySelectorAll("*").forEach(elem => {
          elem.remove();
          if (elem.tagName != "SCRIPT") {
            document.head.appendChild(elem.cloneNode(true));
          } else {
            const newScript = document.createElement("script");
            newScript.textContent = elem.textContent;
            for (let attrIndex = 0; attrIndex < elem.attributes.length; attrIndex++) {
              const elemAttr = elem.attributes.item(attrIndex);
              if (elemAttr != null) {
                newScript.setAttribute(elemAttr.name, elemAttr.value);
              }
            }
            document.head.appendChild(newScript);
          }
        });

        console.log("IMPORTS");
      } else {
        console.error("Request failed.  Returned status of " + xhr.status);
      }
    }
  };
  // document.addEventListener("DOMContentLoaded", () => {
  // open the request and send it
  xhr.responseType = "document";
  xhr.open("GET", url);
  xhr.send();
  // });
}

export function loadHTML(url, selector, prefix = "", suffix = "") {
  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.readyState == xhr.DONE && xhr.status == 200) {
      const wrapper = document.querySelector(selector);

      const response = xhr.responseXML;
      response.querySelectorAll("*").forEach(elem => {
        const srcPath = elem.getAttribute("src");
        if (srcPath != null && srcPath != "") {
          elem.src = prefix + srcPath + suffix;
        }
      });
      response.querySelectorAll("link").forEach(elem => {
        document.head.appendChild(elem);
      });
      wrapper.innerHTML += response.body.innerHTML;
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
    }
  };

  xhr.open("GET", url);
  xhr.responseType = "document";
  xhr.send();
  console.log("UPDATING SCRIPTS!!!");
}

export function changeSources(url, selector = "*", prefix = "", suffix = "") {
  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.readyState == xhr.DONE && xhr.status == 200) {
      const response = xhr.responseXML;
      const wrapper = response.querySelector(selector);
    }
  };

  xhr.open("GET", url);
  xhr.responseType = "document";
  xhr.send();
}

/***Marks/Removes all current scripts (that have already been ran / loaded) */
const markScripts = (removeScripts = false) => {
  document.querySelectorAll("script:not([data-executed])").forEach(s => {
    if (removeScripts) s.remove();
    else s.setAttribute("data-executed", "true");
  });
};

const remakeScripts = scriptList => {
  scriptList.forEach(s => {
    s.setAttribute("data-executed", "true");
    s.remove();
    const newScript = document.createElement("script");
    for (let attrIndex = 0; attrIndex < s.attributes.length; attrIndex++) {
      if (s.attributes.item(attrIndex) !== null) {
        newScript.setAttribute(s.attributes.item(attrIndex).name, s.attributes.item(attrIndex).value);
      }
    }
    document.head.appendChild(newScript);
  });
};
