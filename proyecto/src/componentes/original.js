import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const storage = getStorage();
const auth = getAuth();

export default function mostrarOriginal(onPublicacionExitosa) {
  const app = document.getElementById("app");
  app.innerHTML = `
  <div class="form">
    <h2>📤 Subir Anime</h2>

    <label>Imagen del anime:</label>
    <input type="file" id="animeImg" accept="image/*" />

    <label>Reseña:</label>
    <textarea id="animeReview" placeholder="Escribe tu reseña..." rows="4"></textarea>

    <button id="btnUpload" class="btn">Publicar</button>
  </div>
  `;

  document.getElementById("btnUpload").addEventListener("click", async () => {
    const file = document.getElementById("animeImg").files[0];
    const review = document.getElementById("animeReview").value;
    const user = auth.currentUser;

    if (!user) {
      alert("Debes iniciar sesión para publicar");
      return;
    }

    if (!file || !review.trim()) {
      alert("Debes subir una imagen y escribir una reseña 😼");
      return;
    }

    try {
      // Subir imagen
      const imgRef = ref(storage, `animes/${Date.now()}_${file.name}`);
      await uploadBytes(imgRef, file);
      const imgURL = await getDownloadURL(imgRef);

      // Guardar en Firestore
      await addDoc(collection(db, "posts"), {
        imgURL,
        review,
        userID: user.uid,
        userName: user.displayName || "Anon",
        createdAt: new Date()
      });

      alert("🔥 Anime publicado con éxito!");
      if (onPublicacionExitosa) onPublicacionExitosa();

    } catch (error) {
      alert("Error publicando: " + error.message);
    }
  });
}
