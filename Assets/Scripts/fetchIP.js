export async function getIP() {
  try {
    const response = await fetch("https://api.ipify.org/?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}

export async function isIP(ip = "") {
  return getIP() == ip;
}

// ! NOT IN CURRENT USE
