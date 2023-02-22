class YesNoSelect extends HTMLElement {
  localShadow;
  active = false;
  constructor() {
    super();
    this.localShadow = this.attachShadow({ mode: "open" });
    this.label = "";
    this.localShadow.innerHTML = `
        <div class="all-wrapper"> 
            <div id="div-cursor"></div>
            <div class="text-display"></div>
        </div>
        <style>
            div.all-wrapper { 
                position: relative;
                aspect-ratio: 1/1;
                min-width: 2.3em;
                width: fit-content;
                border-radius: 1.3em;
                display: grid;
                place-items: center;
                padding: 0.3em;
            }
            div.all-wrapper * {
                position: absolute;
            }
            div.text-display {
                position: relative;
                width: fit-content;
                height: fit-content;
                text-align: center;
                color: inherit;
                text-shadow: inherit;
                -webkit-user-select: none; /* user text selection */
                -moz-user-select: none; 
                -ms-user-select: none; 
                user-select: none; 
            }
            div#div-cursor {
                position:absolute; width: 100%; height: 100%; cursor: pointer;
                z-index: ${this.style.zIndex + 1};
            }

        </style> `;

    this.active = false;
    this.value = "false";
    this.addEventListener("click", (eve) => {
      this.active = !this.active;
      this.setAttribute("value", this.active ? "true" : "false");
      this.value = this.getAttribute("value");
    });
  }

  connectedCallback() {
    this.setAttribute("value", "false");
    this.setAttribute("show", "true");
    this.render(this.getAttribute("value"));
  }

  disconnectedCallback() {}

  adoptedCallback() {}
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "value":
        if (Boolean(this.getAttribute("show"))) {
          this.render(this.getAttribute("value"));
        }
      case "show":
        let textDisplay = this.localShadow.querySelector("div.text-display");
        if (Boolean(this.getAttribute("show"))) {
          textDisplay.style.display = "";
        } else {
          textDisplay.style += "display: none;";
        }
        break;
      case "label":
        this.label = newValue;
        break;
    }
  }

  static get observedAttributes() {
    return ["value", "show", "label"];
  }

  get isActive() {
    return this.active;
  }

  render(text) {
    let textDiv = this.localShadow.querySelector("div.text-display");
    text = String(text).replace(/"/g, "");

    textDiv.innerHTML = (text == "true" ? "✔" : "✖") + this.label;
  }
}

customElements.define("yn-select", YesNoSelect);
