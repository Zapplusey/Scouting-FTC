import { userStorageKeys, UserForm } from "./userform.js";
import { getDocsData__, deleteDoc__, getDoc__ } from "./firebase_script.js";
// Approving / rejecting requests
const approveRequest = async name => {
  const doc_ = await getDoc__(["managers-messages", name]);
  deleteDoc__(["managers-messages", name]);
  new UserForm(doc_.user.username, doc_.user.password, doc_.user.position, doc_.user.email).addUser();
};

const rejectRequest = async name => {
  deleteDoc__(["managers-messages", name]);
};

// WELCOMING TEXT (GREETING)
const textChange = document.querySelector("p.welcome.text").querySelector("span.greeted");
const changeGreeting = (userName = null) => {
  switch (userName) {
    case null:
      textChange.textContent = "guest";
      break;
    default:
      textChange.textContent = userName;
  }
};
window.addEventListener("userChange", eve => {
  if (eve.detail.storageArea == sessionStorage) {
    changeGreeting(eve.detail.username);
  }
  if (eve.detail.userposition != "manager") {
  }
});
changeGreeting(sessionStorage.getItem(userStorageKeys.name));

// SIGN UP
const signupForm = document.querySelector(".dashboard .sign-in-menu");
const nameInput = signupForm.querySelector(".input.username"),
  passwordInput = signupForm.querySelector(".input.password"),
  positionInput = signupForm.querySelector(".input.position"),
  emailInput = signupForm.querySelector(".input.email"),
  issueMessage = signupForm.querySelector("div.issue");
const submitButton = signupForm.querySelector(".btn.submit");
const invalidCharacters = "./\\פםןוטארק,ףךלחיעכגדשץתצמנהבסז";
const invalidCharactersArr = invalidCharacters.split("");
submitButton.addEventListener("click", () => {
  console.log("CODE RIUN 1");
  issueMessage.textContent = "";
  let b1 = passwordInput.value.trim().length < 8;
  let b2 = !emailInput.value.includes("@");
  let b3 = false;
  for (let chi = 0; chi < invalidCharactersArr.length; chi++) {
    if (
      passwordInput.value.includes(invalidCharactersArr[chi]) ||
      nameInput.value.includes(invalidCharactersArr[chi])
    ) {
      b3 = true;
      break;
    }
  }
  if (b1) {
    issueMessage.textContent += " Passwords must be at least 8 characters long.";
  }
  if (b3) {
    issueMessage.textContent += " Passwords and nicknames must not include:" + invalidCharacters + " .";
  }
  if (b2) {
    issueMessage.textContent += " Emails must include '@'.";
  }
  console.log("CODE RIUN");
  if (!(b1 || b2 || b3)) {
    let signinUser = new UserForm(nameInput.value, passwordInput.value, positionInput.value, emailInput.value);
    signinUser.requestAddUSer();
    refreshMessages(sessionStorage.getItem(userStorageKeys.position));
  }
});

// MANAGER MESSAGES

const messageMenu = document.querySelector(".dashboard .message-menu");
const messagesContainer = messageMenu.querySelector(".messages-container");

const refreshMessages = async userPos => {
  messagesContainer.innerHTML = ""; // Clears messages container
  console.log(userPos);
  if (userPos != "manager") {
    messageMenu.classList.add("invisible");
    return;
  } else {
    messageMenu.classList.remove("invisible");
  }
  const messages = await getDocsData__(["managers-messages"]);
  if (messages != null)
    messages.forEach(message => {
      console.log(message);
      if (message.type == "approve") {
        const messageElem = document.createElement("div");
        messageElem.classList.add("message");
        messageElem.textContent = `${message.user.username} sent a request to approve their account, for a(n) ${message.user.position} position`;
        const confirmButton = document.createElement("span"),
          rejectButton = document.createElement("span");
        confirmButton.textContent = "CONFIRM";
        rejectButton.textContent = "REJECT";
        messageElem.appendChild(document.createElement("br"));
        const actions = [approveRequest, rejectRequest];
        [confirmButton, rejectButton].forEach((btn, btnI) => {
          btn.classList.add("action");

          messageElem.appendChild(btn);
          btn.addEventListener("click", () => {
            actions[btnI](message.user.username);
            messageElem.classList.add("removed");
            setTimeout(() => {
              messageElem.remove();
            }, 500);
          });
        });
        messagesContainer.appendChild(messageElem);
      }
    });
};
refreshMessages(sessionStorage.getItem(userStorageKeys.position));

window.addEventListener("userChange", eve => {
  refreshMessages(eve.detail.userposition);
});

// Not permitted alert

const displayAlert = sessionStorage.getItem("displayAlert");
if (displayAlert === "true") {
  sessionStorage.removeItem("displayAlert");
  alert("You are not permitted to enter this page!");
}
