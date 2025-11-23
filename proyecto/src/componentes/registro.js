import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig.js';

export default function mostrarRegistro() {
  const app = document.getElementById("app");
  app.innerHTML = `
  <div class="form">
    <h2>Registro</h2>
    <input type="text" id="nombre" placeholder="Nombre">
    <input type="email" id="correo" placeholder="Correo electrónico">
    <input type="password" id="contrasena" placeholder="Contraseña">
    <input type="text" id="fecha" placeholder="Fecha de nacimiento">
    <input type="tel" id="telefono" placeholder="Teléfono">
    <button id="btnRegistro" class="btn">Registrarse</button>
  </div>
  `;

  document.getElementById("btnRegistro").addEventListener("click", async () => {
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;
    const fecha = document.getElementById("fecha").value;
    const telefono = document.getElementById("telefono").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;

      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid,
        nombre,
        correo,
        fecha,
        telefono,
        ganados: 0,
        perdidos: 0
      });

      alert('Usuario registrado correctamente 😎');
    } catch (error) {
      alert('Error al registrarse: ' + error.message);
    }
  });
}
