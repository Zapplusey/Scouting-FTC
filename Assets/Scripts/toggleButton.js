const addToggle = (t) => {
  t.addEventListener("click", () => toggleOnClick(t));
};
const toggleOnClick = (t) => {
  t.classList.toggle("active");
};
const toggles = document.querySelectorAll("button.toggle");
toggles.forEach(addToggle);
