const menuToggleExecution = () => {
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
  const indexAttr = "data-menu-index";

  const menuToggles = Array.from(document.querySelectorAll(".menu-toggle"));
  const menusToggled = Array.from(document.querySelectorAll(".menu-toggled"));
  sortByAttribute(menuToggles);
  sortByAttribute(menusToggled);

  menuToggles.forEach((toggle, i) => {
    const matchingToggle = menusToggled[i];
    toggle.classList.remove("active");
    matchingToggle.classList.remove("active");

    const toggleClick = () => {
      toggle.classList.toggle("active");
      matchingToggle.classList.toggle("active");
    };

    toggle.addEventListener("click", toggleClick);
    for (clickable of matchingToggle.querySelectorAll(".clickable")) {
      clickable.addEventListener("click", toggleClick);
    }
  });
};

window.addEventListener("load", menuToggleExecution);
