import { UserForm, userStorageKeys, dispatchUserChangeEvent } from "./userform.js";
const loginForm = document.querySelector("div.login-main-menu .login-page .form");

const submitButton = loginForm.querySelector(".btn.submit");
const nameInput = loginForm.querySelector("input.user-name"),
  passwordInput = loginForm.querySelector("input.password");
const noteTextError = loginForm.parentElement.querySelector(".note-text.error");
const noteTextLogged = loginForm.parentElement.querySelector(".note-text.logged"),
  noteTextLoggedPosition = noteTextLogged.querySelector("span.text.position"),
  noteTextLoggedPerson = noteTextLogged.querySelector("span.text.person"),
  noteTextLoggedLogout = noteTextLogged.querySelector("span.logout");
submitButton.addEventListener("click", eve => {
  let user = new UserForm(nameInput.value, passwordInput.value);
  user.loadUserToStorage().then(success => {
    if (success[1]) {
      noteTextLoggedPosition.textContent = sessionStorage.getItem(userStorageKeys.position);
      noteTextLoggedPerson.textContent = sessionStorage.getItem(userStorageKeys.name);
      // TODO USER CHANGE EVENT
      // noteTextError.style = "display: none";
      noteTextLogged.style = "";
    } else {
      // noteTextError.style = "";
      noteTextLogged.style = "display: none";
      if (success[0]) {
        noteTextError.textContent = "Password is incorrect";
      } else {
        noteTextError.textContent = "Username wasn't found, try again";
      }
    }
  });
});
if (sessionStorage.getItem(userStorageKeys.name)) {
  noteTextLoggedPosition.textContent = sessionStorage.getItem(userStorageKeys.position);
  noteTextLoggedPerson.textContent = sessionStorage.getItem(userStorageKeys.name);
  noteTextError.style = "display: none";
}
const setLoginFormVisability = eve => {
  if (eve.detail.storageArea == sessionStorage) {
    loginForm.style = eve.detail.username == null ? "" : "display: none;";
    noteTextLogged.style = eve.detail.username != null ? "" : "display: none;";
  }
};
window.addEventListener("userChange", setLoginFormVisability);
// Updates for the first time
const isLoggedIn_RightNow = sessionStorage.getItem(userStorageKeys.name) != null;
loginForm.style = !isLoggedIn_RightNow ? "" : "display: none;";
noteTextLogged.style = isLoggedIn_RightNow ? "" : "display:none;";
noteTextLoggedLogout.addEventListener("click", () => {
  UserForm.removeCurrentUser();
});
