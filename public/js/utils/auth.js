// auth.js

(function (global) {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Token inválido:", e);
      return null;
    }
  }

  function isTokenExpired(payload) {
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp < now;
  }

  function authGuard() {
    let token = sessionStorage.getItem("token");

    token = getCookie("token");
    if (token) sessionStorage.setItem("token", token);

    if (!token) {
      alert("Token inexistente");
      return false;
    }

    const payload = parseJwt(token);
    if (!payload) {
      alert("Token inválido.");
      return false;
    }

    if (isTokenExpired(payload)) {
      alert("Tu sesión expiró. Por favor iniciá sesión nuevamente.");
      sessionStorage.removeItem("token");
      return false;
    }

    return true; // ✅ Token válido y no expirado
  }

  function hasPermission(requiredPermission) {
    const token = sessionStorage.getItem("token");
    if (!token) return false;

    const payload = parseJwt(token);
    return (
      payload &&
      payload.permissions &&
      payload.permissions.includes(requiredPermission)
    );
  }

  // Exponer las funciones en un namespace global
  global.auth = {
    authGuard,
    hasPermission,
    parseJwt
  };
})(window);
