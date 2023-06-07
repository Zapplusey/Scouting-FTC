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
    if (i > filtered.length - 1) return; // Making sure array (selected) index isn't bigger than its length
    const matchingFiltered = filtered[i]; // Finding the corresponding table
    const filterExcluded = { min: 0, max: 0 };
    let excludeFilteredAttr = [];
    const updateFilterExclusion = () => {
      excludeFilteredAttr = matchingFiltered.getAttribute("data-exclude-filtered").split("-");
      if (excludeFilteredAttr.length == 2) {
        [filterExcluded.min, filterExcluded.max] = excludeFilteredAttr;
      } else {
        filterExcluded.min = filterExcluded.max = 0;
      }
    };
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type == "attributes" && mutation.attributeName == "data-exclude-filtered") {
          updateFilterExclusion();
          console.log("changed");
        }
      });
    });
    observer.observe(matchingFiltered, { attributes: true });
    updateFilterExclusion();
    let rowsDisplayNone = false;
    const operators = [">", "<"]; // Filter input operators (to detected different values...)
    // Filter input callback
    filter.addEventListener("input", eve_ => {
      const filterText = filter.value.trim().toLocaleLowerCase();
      const colonIndex = filterText.indexOf(":", 1);

      const attrName = filterText.substring(0, colonIndex).trim().toLocaleLowerCase();
      const filterValue = filterText
        .substring(colonIndex + 1, filterText.length)
        .trim()
        .toLocaleLowerCase();
      // Filter by row name
      if (colonIndex == -1) {
        rowsDisplayNone = true;
        matchingFiltered.querySelectorAll("tr").forEach((row, rowIndex) => {
          if (rowIndex >= filterExcluded.min && rowIndex < filterExcluded.max) return; // Skips a certain range....
          rowIndex++;
          const label = row.querySelector("td").innerText.toLocaleLowerCase();
          if (label.includes(filterText)) {
            const previousDisplay = row.getAttribute("data-temp-tableFilter-style");
            if (previousDisplay != null) row.style.display = previousDisplay;
            else row.style.display = "";
          } else if (row.style.display != "none") {
            row.setAttribute("data-temp-tableFilter-style", row.style.display);
            row.style.display = "none";
          }
        });
      }
      // Filter by row and column value
      else {
        const tableRows = matchingFiltered.querySelectorAll("tr");
        const columnsCount = tableRows.item(0).querySelectorAll("td").length;
        let rowNameIndex = 0;
        // Detecting wanted column (by name)
        tableRows.forEach((row, rowI) => {
          const currentColumn = row.querySelector("td");
          if (currentColumn.innerHTML.trim().toLocaleLowerCase().includes(attrName)) {
            rowNameIndex = rowI;
          }
        });
        // Resetting display
        if (rowsDisplayNone)
          tableRows.forEach(row => {
            if (row.style.display == "none") {
              const previousDisplay = row.getAttribute("data-temp-tableFilter-style");
              if (previousDisplay != null) row.style.display = previousDisplay;
              else row.style.display = "";
            }
          });

        // Going over each column and item in that row and filtering
        tableRows
          .item(rowNameIndex)
          .querySelectorAll("td")
          .forEach((columnElem, columnI) => {
            if (columnI == 0) return;
            if (columnElem.innerText.trim().toLocaleLowerCase().includes(filterValue)) {
              tableRows.forEach((row, rowI) => {
                const tableCell = row.querySelectorAll("td").item(columnI);
                const previousDisplay = tableCell.getAttribute("data-temp-tableFilter-style");
                if (previousDisplay != null) tableCell.style.display = previousDisplay;
                else tableCell.style.display = "";
              });
            } else {
              tableRows.forEach((row, rowI) => {
                const tableCell = row.querySelectorAll("td").item(columnI);
                if (tableCell.style.display != "none") {
                  tableCell.setAttribute("data-temp-tableFilter-style", tableCell.style.display);
                  tableCell.style.display = "none";
                }
              });
            }
          });
      }
    });
  });
};

window.addEventListener("load", tableFilterExecute);
