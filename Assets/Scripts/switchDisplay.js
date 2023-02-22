class SwitchDisplay extends HTMLElement {
  localShadow;
  constructor() {
    super();
    // Setting / declaring values...
    this.localShadow = this.attachShadow({ mode: "open" });
    this.defaultSize = 3;
    this.default_style_color = "#102466";
    this.value = "No selection";
    this.selectionIndex = 0;

    this.localShadow.innerHTML = `
            <table class="all-wrapper">
                <tr id="titles">
                </tr>
                <tr id="images">
                </tr>
                <tr id="buttons">
                </tr>

            </table>
            <style> 
                .all-wrapper { --main_color: ${this.default_style_color}; }
                    
                
                .all-wrapper, tr, tbody {
                    width: fit-content;
                }
                tr {
                    position: relative;
                    display: flex;
                    justify-content: space-around;
                    flex-direction: column;
                    height: max-content;
                }
                td {
                  position: relative;
                  display: block;
                  justify-content: center;
                  flex-direction: row;
                  
                  height: max-content;
                  margin: 0em 0.3em;
                }
                .all-wrapper *, tbody *, tbody {
                    position: relative;
                  
                }
                #buttons {
                    display: flex;
                    justify-content: space-between;
                    gap: 0.2em;
                }
                #buttons * {
                    cursor: pointer;
                    --sd_default: 1.5em;
                    display: inline-block;
                    aspect-ratio: 1/1;
                    min-width: calc(var(--sd_default));
                    height: auto;
                    border: 0.1em solid var(--main_color);
                    border-radius: 10.3em;
                    transition: background 300ms ease-in-out, box-shadow 250ms ease-in-out 30ms;
                }
                #buttons .active {
                    box-shadow: 0 0 0.3em 0 var(--main_color) inset, 0 0 0.2em 0 var(--main_color) inset, 0 0 0.4em 0 var(--main_color);
                    
                    }
                #buttons *::before {
                    content: "";
                    position: absolute;
                    inset: 51%;
                    background-color: var(--main_color);
                    border-radius: 10.3em;
                    transition: inset 325ms ease;
                }
                #buttons .active::before {
                    inset: 14%;
                    border-radius: 10em;
                }
                #titles * {
                   color: var(--main_color);
                   font-size: 120%;   
                }
                tbody { display: flex; flex-direction:row-reverse; width: fit-content; justify-items: space-between; align-items: space-between;}
                table { table-layout: fixed;}    
            </style>
        `;
    // Setup for listener
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.attributeName == "style") {
          this.style.setProperty(
            "--main_color",
            window.getComputedStyle(this).color
          );
          console.log("changed Color!");
        }
      });
    });
  }

  connectedCallback() {
    this.observer.observe(this, { attributes: true });
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const insertElementsFromString = (str_, format, wrapper) => {
      let c = 0;
      str_.split(";").forEach((e) => {
        wrapper.innerHTML += format(e);
        c++;
      });
      return c;
    };

    switch (name) {
      case "titles":
        let titlesElement = this.localShadow.getElementById("titles");
        titlesElement.innerHTML = "";
        const c = insertElementsFromString(
          newValue,
          (x) => `<td>${x}</td>`,
          titlesElement
        );
        this.clearButtons();
        for (let i = 0; i < c; i++) {
          this.addOptionButton();
        }
        const imgElements = this.localShadow.querySelectorAll(
          ".all-wrapper images"
        );
        for (let i = 0; i < c - imgElements.length; i++) {
          this.addImage();
        }

        break;
      case "images":
        let imagesElement = this.localShadow.getElementById("images");
        imagesElement.innerHTML = "";
        insertElementsFromString(
          newValue,
          (x) => `<td><img src="${x}"></td>`,
          imagesElement
        );
        break;
    }
    window.setTimeout(() => {
      const table = this.localShadow.querySelector("table.all-wrapper");
      const rows = table.querySelectorAll("tr");
      console.log(window.getComputedStyle(rows.item(0)).height);
      let maxRowHeight = 0;
      rows.forEach((row, i) => {
        const currentRowHeight = parseInt(
          getComputedStyle(row).height.replace("px", "")
        );
        console.log(currentRowHeight);
        if (currentRowHeight > maxRowHeight) maxRowHeight = currentRowHeight;
      });
      rows.forEach((row) => {
        row.style.height = maxRowHeight + "px";
      });
    }, 2);
  }

  clearButtons() {
    const buttonsWrapper = this.localShadow.getElementById("buttons");
    buttonsWrapper.innerHTML = "";
  }

  addOptionButton() {
    const buttonsWrapper = this.localShadow.getElementById("buttons");
    const tempButton = document.createElement("td");
    tempButton.classList.add("button");
    tempButton.setAttribute(
      "index",
      buttonsWrapper.querySelectorAll(".button").length
    );
    buttonsWrapper.appendChild(tempButton);

    tempButton.addEventListener("click", (eve) => {
      buttonsWrapper.querySelectorAll(".button").forEach((e) => {
        e.classList.remove("active");
      });
      tempButton.classList.add("active");
      const selectedIndex = tempButton.getAttribute("index");
      this.value = this.getTitleValue(parseInt(selectedIndex));
      this.selectionIndex = selectedIndex;
    });
  }

  addImage(src = "") {
    this.localShadow.getElementById(
      "images"
    ).innerHTML += `<td><img src="${src}"></td>`;
  }

  getTitleValue(index) {
    const titlesElement = this.localShadow.getElementById("titles");
    const title = titlesElement.children.item(index);
    return title.innerHTML;
  }

  getValue() {
    return this.value;
  }
  get selectedIndex() {
    return this.selectionIndex;
  }

  static get observedAttributes() {
    return ["titles", "images"];
  }
}

customElements.define("switch-display", SwitchDisplay);
