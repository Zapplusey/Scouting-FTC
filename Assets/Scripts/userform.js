import { getDocsDatabase__, getDoc__, writeDoc__ } from "./firebase_script.js";

export const userStorageKeys = { name: "currentUser", password: "userPass", position: "userPos" };
export const positionValues = { guest: 0, scouter: 1, observer: 2, manager: 3 };
export class UserForm {
  constructor(_username = "", _password = "", _position = "", _email = "") {
    this.fields = { username: _username, password: _password, position: _position, email: _email };

    let allValidated = true;
    // Object.values(this.fields).forEach(val => {
    //   if (!validateValue(val)) {
    //     allValidated = false;
    //   }
    // });
  }

  async loadUserToStorage(user_ = this) {
    if (!user_.fields.username) {
      // If the username is blank -> it creates an error when trying to get the file name
      return [false, false];
    }
    const userFile = await getDoc__(["accounts", user_.fields.username]);
    const isNameCorrect = userFile != null,
      isPassCorrect = isNameCorrect ? userFile.password == user_.fields.password : false;
    if (isPassCorrect && sessionStorage.getItem(userStorageKeys.name) == null) {
      sessionStorage.setItem(userStorageKeys.name, user_.fields.username);
      sessionStorage.setItem(userStorageKeys.position, userFile.position);
      dispatchUserChangeEvent(user_.fields.username, userFile.position);
    }
    return [isNameCorrect, isPassCorrect];
  }

  static removeCurrentUser() {
    sessionStorage.removeItem(userStorageKeys.name);
    sessionStorage.removeItem(userStorageKeys.position);
    dispatchUserChangeEvent(null, null);
  }

  validateForm(user_ = this) {
    let isTotallyValid = true;
    Object.values(user_.fields).every(val => {
      if (val == "" || val == null) isTotallyValid = false;
      return false;
    });
    return isTotallyValid;
  }

  async addUser(user_ = this) {
    if (this.validateForm(user_)) {
      writeDoc__(["accounts", user_.fields.username], {
        name: user_.fields.username,
        password: user_.fields.password,
        position: user_.fields.position,
        email: user_.fields.email,
      });
    }
  }

  async requestAddUSer(user_ = this) {
    if (this.validateForm(user_)) {
      writeDoc__(["managers-messages", user_.fields.username], { type: "approve", user: user_.fields });
      alert("Your request had been sent, please wait for approval");
    }
  }
}

export function dispatchUserChangeEvent(name, pos) {
  // The
  window.dispatchEvent(
    new CustomEvent("userChange", {
      detail: {
        userposition: pos,
        username: name,
        storageArea: sessionStorage,
      },
    })
  );
}

export function redirectByPosition(minPosition) {
  const userPos = sessionStorage.getItem(userStorageKeys.position);
  if (positionValues[userPos] < positionValues[minPosition] || userPos == null) {
    sessionStorage.setItem("displayAlert", "true");
    window.location.replace("./index.html");
  }
}
