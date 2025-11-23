import mostrarRegistro from './componentes/registro.js';
import mostrarLogin from './componentes/login.js';
import mostrarOriginal from './componentes/original.js';
import mostrarHome from './componentes/home.js';
import mostrarLogout from './componentes/logout.js';
import { auth } from './firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';
import './style.css';

document.addEventListener("DOMContentLoaded", () => {

  const menu = document.getElementById("menu");

  // ---- Callback cuando alguien publica ----
  const onPublicacionExitosa = () => {
    // puedes reemplazar el alert por una toast si quieres
    alert("🔥 Anime publicado con éxito!");
    mostrarHome(); // volver a Home y cargar publicaciones
  };

  // ---- Navegación simple ----
  const navegar = (vista) => {
    switch (vista) {
      case "home":
        mostrarHome();
        break;
      case "original":
        // pasar callback para que original.js lo invoque al terminar
        mostrarOriginal(onPublicacionExitosa);
        break;
      case "login":
        mostrarLogin();
        break;
      case "registro":
        mostrarRegistro();
        break;
      case "logout":
        mostrarLogout();
        break;
      default:
        mostrarHome();
    }
  };

  const cargarMenuAuth = () => {
    menu.innerHTML = `
      <nav>
        <button id="menuHome">🏠 Home</button>
        <button id="menuOriginal">📤 Subir Anime</button>
        <button id="menuLogout">🚪 Salir</button>
      </nav>
    `;

    document.getElementById("menuHome").onclick = () => navegar("home");
    document.getElementById("menuOriginal").onclick = () => navegar("original");
    document.getElementById("menuLogout").onclick = () => navegar("logout");

    navegar("home"); // Pantalla inicial
  };

  const cargarMenuNoAuth = () => {
    menu.innerHTML = `
      <nav>
        <button id="menuLogin">Login</button>
        <button id="menuRegistro">Registro</button>
      </nav>
    `;

    document.getElementById("menuLogin").onclick = () => navegar("login");
    document.getElementById("menuRegistro").onclick = () => navegar("registro");

    navegar("login");
  };

  // ---- Detectar estado de auth ----
  onAuthStateChanged(auth, (user) => {
    if (user) {
      cargarMenuAuth();
    } else {
      cargarMenuNoAuth();
    }
  });

});

