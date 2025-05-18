function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Leer el token
const token = getCookie("token");

// Guardarlo en sessionStorage si lo necesitás
if (token) {
  sessionStorage.setItem("token", token);
}

alert(token)