const tableFilterExecute = () => {
  const sortByAttribute = (arr = [], attr = "index") => {
    arr.sort((a, b) => {
      const aIndex = parseInt(a.getAttribute(attr)),
        bIndex = parseInt(b.getAttribute(attr));
      if (aIndex < bIndex) return 1;
      if (aIndex > bIndex) return -1;
      return 0;
    });
    return arr;
  };

  const filtered = Array.from(document.querySelectorAll(".filterTable"));
  const filters = Array.from(document.querySelectorAll(".tableFilters"));

  sortByAttribute(filtered, "data-filtered-index");
  sortByAttribute(filters, "data-filtered-index");

  filters.forEach((filter, i) => {
    // * Finding the table
    if (i > filtered.length - 1) return;
    const matchingFiltered = filtered[i];
    filter.addEventListener("input", () => {
      let rowIndex = 0;
      for (const row of matchingFiltered.querySelectorAll("tr")) {
        rowIndex++;
        if (rowIndex <= 2) continue; // If row index < 2 (AKA name and scouter's name...) skip
        const label = row.querySelector("td").innerText.toLocaleLowerCase();
        if (label.includes(filter.value.trim().toLocaleLowerCase())) {
          const previousDisplay = row.getAttribute(
            "data-temp-tableFilter-style"
          );
          if (previousDisplay != null) row.style.display = previousDisplay;
          else row.style.display = "";
        } else if (row.style.display != "none") {
          row.setAttribute("data-temp-tableFilter-style", row.style.display);
          row.style.display = "none";
        }
      }
    });
  });
};

window.addEventListener("load", tableFilterExecute);
