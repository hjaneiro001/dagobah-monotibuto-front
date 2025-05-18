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

document.cookie = "token=; path=/; domain=.tatooine.com.ar; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=None";

// Si no hay token en sessionStorage, redirigir al login
if (!sessionStorage.getItem("token")) {
  window.location.href = "https://stage.login.tatooine.com.ar?url=stage.dagobah.tatooine.com.ar";
}