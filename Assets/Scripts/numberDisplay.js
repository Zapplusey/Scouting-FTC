class numberDisplay extends HTMLElement {
  localShadow;
  constructor() {
    super();
    this.localShadow = this.attachShadow({ mode: "open" });
    this.defaultValue = 0;
    this.value = this.defaultValue;
    this.valueUpdate = function () {};

    this.localShadow.innerHTML = `
        <div id="main-wrapper">
            <span id="adder">+</span>
            <span id="num_display">0</span>
            <span id="reducer">-</span>
        </div>

        <style>
            div#main-wrapper {
                position: relative;
                display: flex;
                flex-direction: row;
                justify-content: center;
                width: fit-content;
                height: fit-content;
            }
            span#adder, span#reducer, span#num_display {
                font-size: 1.1em;
                position: relative;
                display: inline-block;
                /*aspect-ratio: 1/1;*/
                --span-size: 1em;
                width: fit-content;
                height: fit-content;
                -webkit-user-select: none; /* user text selection */
                -moz-user-select: none; 
                -ms-user-select: none; 
                user-select: none; 
                border-sizing: content-box;
                padding: 0em 0.2em;
                margin: 0em 0.0em;
                border-radius: 30em;
                transition: box-shadow 200ms ease-in-out 0ms, background 150ms ease-in-out 150ms, font-size 100ms ease-in-out;
                text-align: center;
                align-items: center;
            }
            span#adder.clicked, span#reducer.clicked {
                background: hsla(210deg, 90%, 90%, 0.8);
                box-shadow: 0 0 0.4em 0 rgba(255,255,255,0.9) inset, 0 0 0.2em 0 rgba(255,255,255,0.7) inset, 0 0 0.5em 0 rgba(255,255,255,0.7), 0 0 0.8em 0 rgba(255,255,255,0.6);
            }

            span#num_display {
                cursor: default;
            }

            span#adder, span#reducer {
                cursor: pointer;
            }
        </style>
        `;
  }

  connectedCallback() {
    // Startup
    this.style.contentVisibility = "visible"; // Enabled rendering
    this.style.height = "fit-content";

    // Setting up attributes and values...
    this.setValue(this.defaultValue);
    this.localShadow.querySelectorAll("#adder, #reducer").forEach(e => {
      e.setAttribute("currentTimeOut", "NONE");
    });

    // Setting up events...
    const displayClick = e => {
      e.classList.add("clicked");
      if (e.getAttribute("currentTimeOut") != "NONE") window.clearTimeout(parseInt(e.getAttribute("currentTimeOut"))); // Removes previous timeout
      e.setAttribute(
        "currentTimeOut",
        window.setTimeout(() => {
          // Sets timeout
          e.classList.remove("clicked");
        }, 250)
      );
    };

    let number_display = this.localShadow.getElementById("num_display");

    this.localShadow.getElementById("adder").addEventListener("click", eve => {
      let updatedNum = parseInt(number_display.innerHTML) + 1;
      this.setValue(updatedNum);
      displayClick(this.localShadow.getElementById("adder"));
    });
    this.localShadow.getElementById("reducer").addEventListener("click", eve => {
      let currentNum = parseInt(number_display.innerHTML);
      this.setValue(currentNum > 0 ? currentNum - 1 : currentNum);
      displayClick(this.localShadow.getElementById("reducer"));
    });
  }

  setValue(value) {
    this.setAttribute("value", value);
    this.value = value;
    this.localShadow.getElementById("num_display").innerHTML = value.toString();
    this.valueUpdate();
  }

  getNumDisplayElement() {
    return this.localShadow.getElementById("num_display");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "value":
        this.value = newValue;
        this.localShadow.getElementById("num_display").innerHTML = newValue.toString();
        break;
      case "changable":
        const tempFunc = e => (e.style.display = newValue == "true" ? "inline-block" : "none");
        tempFunc(this.localShadow.getElementById("adder"));
        tempFunc(this.localShadow.getElementById("reducer"));
    }
  }

  static get observedAttributes() {
    return ["value", "changable"];
  }
}
customElements.define("number-display", numberDisplay);

class polesDisplay extends HTMLElement {
  localShadow;
  constructor() {
    super();
    this.localShadow = this.attachShadow({ mode: "open" });
    this.manualDisplay = false;
    this.shadowRoot.innerHTML = `
        <div class="all-wrapper">
            <img id="image-display" src="" />
            <div id="title"></div>
            <div id="number-display-wrapper">
            </div>
        </div>
        <style>
            img {
                grid-area: img;
                display: inline;
                position: relative;
                object-fit: contain;
                --sizing: 2em;
                width: var(--sizing); 
                height: auto;
                margin: 0;
                padding: 0; 
            }

            div.all-wrapper {
                position: relative;
                display: grid;
                grid-template-areas: "img title" "img display";
                place-items: center;
                column-gap: 0.3em;
                width: fit-content;
                height: fit-content;
                
            }
            div.all-wrapper > * {
                user-select: none;
            }

            div#number-display-wrapper {
                grid-area: display;
                display: block;
                display: grid;
                position: relative;
                place-items: center;
            }
            div#title {
                grid-area: title;
            }
        </style>
        `;
    // Declaring value variables
    this.values = [];
    this.value = null;
  }

  connectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "displays":
        if (!this.manualDisplay) this.refreshDisplays(oldValue, newValue);
        break;
      case "image":
        if (typeof newValue === "string" || newValue instanceof String)
          this.localShadow.getElementById("image-display").setAttribute("src", newValue);
        break;
      case "title":
        if ((typeof newValue === "string" || newValue instanceof String) && newValue != "") {
          this.localShadow.getElementById("title").innerHTML = newValue;
        }
        break;
    }
  }

  refreshDisplays(oldValue, newValue) {
    if (isNaN(newValue) || parseInt(oldValue) == parseInt(newValue)) return;
    const displayWrapper = this.localShadow.getElementById("number-display-wrapper");
    if (displayWrapper != null) {
      displayWrapper.innerHTML = "";
      for (let c = 0; c < parseInt(newValue); c++) {
        let numDisplayAdded = document.createElement("number-display");
        numDisplayAdded.valueUpdate = () => {
          this.updateValues(c, numDisplayAdded.value);
        };
        displayWrapper.appendChild(numDisplayAdded);
      }
    }
  }

  updateValues(index, newValue) {
    this.values[index] = newValue;
    this.value = newValue;
  }

  getTitle() {
    return this.getAttribute("title");
  }
  getValue() {
    return this.value;
  }
  getDisplays() {
    return this.localShadow.querySelectorAll("number-display");
  }

  setManualDisplays(amount) {
    this.refreshDisplays(0, amount);
    this.manualDisplay = true;
  }

  setChangable(b = false) {
    this.localShadow.querySelectorAll("number-display").forEach(nd => {
      nd.setAttribute("changable", b);
    });
  }

  setDisplay(index, value) {
    this.localShadow.querySelectorAll("number-display").item(index).setValue(value);
  }

  static get observedAttributes() {
    return ["displays", "image", "title"];
  }
}
customElements.define("poles-display", polesDisplay);
