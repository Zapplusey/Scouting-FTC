const textWrapper = document.querySelector(".offline-wrapper");

if (!navigator.onLine) {
  textWrapper.style.display = "block";
  textWrapper.innerHTML = `No internet, offline ✈`;
}

const refresh = () => location.reload(); // Refreshing current location (address)

window.addEventListener("online", () => {
  location.reload();
});

if (textWrapper)
  if (textWrapper.getAttribute("data-refreshOffline") == "true") {
    window.addEventListener("offline", refresh);
  }
