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

// Si no hay token en sessionStorage, redirigir al login
if (!sessionStorage.getItem("token")) {
   //window.location.href = "https://stage.login.tatooine.com.ar?url=stage.dagobah.tatooine.com.ar";
}