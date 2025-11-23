import mostrarRegistro from './componentes/registro.js';
import mostrarLogin from './componentes/login.js';
import mostrarOriginal from './componentes/original.js';
import mostrarHome from './componentes/home.js';
import mostrarLogout from './componentes/logout.js';
import { auth } from './firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';

document.addEventListener("DOMContentLoaded", () => {

  const menu = document.getElementById("menu");

  const cargarMenuAuth = () => {
    menu.innerHTML = `
      <nav>
        <button id="menuHome">Home</button>
        <button id="menuOriginal">Original</button>
        <button id="menuLogout">Logout</button>
      </nav>
    `;

    document.getElementById("menuHome").onclick = mostrarHome;
    document.getElementById("menuOriginal").onclick = mostrarOriginal;
    document.getElementById("menuLogout").onclick = mostrarLogout;

    mostrarHome(); // Render inicial
  };

  const cargarMenuNoAuth = () => {
    menu.innerHTML = `
      <nav>
        <button id="menuLogin">Login</button>
        <button id="menuRegistro">Registro</button>
      </nav>
    `;

    document.getElementById("menuLogin").onclick = mostrarLogin;
    document.getElementById("menuRegistro").onclick = mostrarRegistro;

    mostrarLogin(); // Render inicial
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      cargarMenuAuth();
    } else {
      cargarMenuNoAuth();
    }
  });

});
