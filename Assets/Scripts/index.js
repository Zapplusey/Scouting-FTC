import { userStorageKeys, UserForm } from "./userform.js";
import { getDocsData__, deleteDoc__, getDoc__ } from "./firebase_script.js";
// Approving / rejecting requests
const approveRequest = async name => {
  const doc_ = await getDoc__(["managers-messages", name]);
  deleteDoc__(["managers-messages", name]);
  new UserForm(doc_.user.username, doc_.user.password, doc_.user.position).addUser();
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
});
changeGreeting(sessionStorage.getItem(userStorageKeys.name));

// SIGN UP
const signupForm = document.querySelector(".dashboard .sign-in-menu");
const nameInput = signupForm.querySelector(".input.username"),
  passwordInput = signupForm.querySelector(".input.password"),
  positionInput = signupForm.querySelector(".input.position");
const submitButton = signupForm.querySelector(".btn.submit");
submitButton.addEventListener("click", () => {
  let signinUser = new UserForm(nameInput.value, passwordInput.value, positionInput.value);
  signinUser.requestAddUSer();
  refreshMessages(sessionStorage.getItem(userStorageKeys.position));
});

// MANAGER MESSAGES

const messageMenu = document.querySelector(".dashboard .message-menu");
const messagesContainer = messageMenu.querySelector(".messages-container");

const refreshMessages = async (userPos = null) => {
  console.log("UPDATING MESSAGES");
  messagesContainer.innerHTML = ""; // Clears messages container
  if (userPos != "manager") return;
  const messages = await getDocsData__(["managers-messages"]);
  messages.forEach(message => {
    console.log(message);
    if (message.type == "approve") {
      const messageElem = document.createElement("div");
      messageElem.classList.add("message");
      messageElem.textContent = `${message.user.username} sent a request to approve his account, for a(n) ${message.user.position} position`;
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
