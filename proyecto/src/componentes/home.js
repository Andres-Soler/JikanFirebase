// componentes/home.js
import { db } from '../firebaseConfig.js';
import { collection, onSnapshot } from 'firebase/firestore';

function timestampToMillis(ts) {
  if (!ts) return 0;
  if (typeof ts === 'number') return ts;
  if (ts.toMillis) return ts.toMillis();
  if (ts instanceof Date) return ts.getTime();
  const parsed = Date.parse(ts);
  return isNaN(parsed) ? 0 : parsed;
}

const MOCK_POSTS = [
  {
    id: "mock-1",
    imgURL: "https://cdn.myanimelist.net/images/anime/1908/135431.jpg",
    review: "“No esperaba que me pegara emocionalmente... y ahora estoy llorando en posición fetal.”",
    userName: "Gato",
    createdAt: Date.now(),
  },
  {
    id: "mock-2",
    imgURL: "https://cdn.myanimelist.net/images/anime/1530/134939.jpg",
    review: "“Esto no debería ser tan adictivo, pero aquí estoy: 3 días sin dormir.”",
    userName: "Kitsu",
    createdAt: Date.now() - 86400000,
  },
  {
    id: "mock-3",
    imgURL: "https://cdn.myanimelist.net/images/anime/1764/135099.jpg",
    review: "“El opening es una obra de arte. Yo? Lo escucho 54 veces al día.”",
    userName: "Senpai",
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "mock-4",
    imgURL: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
    review: "“Pensé que era comedia… ahora estoy emocionalmente destruido, gracias.”",
    userName: "Tora",
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "mock-5",
    imgURL: "https://cdn.myanimelist.net/images/anime/1764/138530.jpg",
    review: "“Plot: 10/10. Música: 10/10. Trauma psicológico: 11/10.”",
    userName: "Luna",
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: "mock-6",
    imgURL: "https://cdn.myanimelist.net/images/anime/1127/111701.jpg",
    review: "“Solo quería ver un capítulo… llevo 17. Mándenme ayuda.”",
    userName: "Anon",
    createdAt: Date.now() - 86400000 * 5,
  },
  {
  id: "mock-7",
  imgURL: "https://cdn.myanimelist.net/images/anime/1015/143219.jpg",
  review: "“Dije: solo un episodio para comer… ahora mi comida está fría y mi vida también.”",
  userName: "Mika",
  createdAt: Date.now() - 86400000 * 6,
},
{
  id: "mock-8",
  imgURL: "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
  review: "“Yo: no voy a llorar. Personaje random: *muere*. Yo: 💔😭”",
  userName: "Akira",
  createdAt: Date.now() - 86400000 * 7,
},
{
  id: "mock-9",
  imgURL: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
  review: "“La trama está buena… pero el opening es mejor que mi futuro.”",
  userName: "Ryo",
  createdAt: Date.now() - 86400000 * 8,
},
{
  id: "mock-10",
  imgURL: "https://cdn.myanimelist.net/images/anime/1517/123018.jpg",
  review: "“Tiene relleno, pero lo disfruto más que mis relaciones sociales.”",
  userName: "Shadow",
  createdAt: Date.now() - 86400000 * 9,
},
{
  id: "mock-11",
  imgURL: "https://cdn.myanimelist.net/images/anime/1352/122548.jpg",
  review: "“Este anime me dio esperanza… y luego la quitó. Arte.”",
  userName: "Yume",
  createdAt: Date.now() - 86400000 * 10,
},
{
  id: "mock-12",
  imgURL: "https://cdn.myanimelist.net/images/anime/1319/114002.jpg",
  review: "“Un día normal:  ✔ comer  ✔ dormir  ✔ obsesionarme con personajes inexistentes.”",
  userName: "Kai",
  createdAt: Date.now() - 86400000 * 11,
},
{
  id: "mock-13",
  imgURL: "https://cdn.myanimelist.net/images/anime/1710/135743.jpg",
  review: "“Cada capítulo mejora... excepto mi salud mental.”",
  userName: "Nova",
  createdAt: Date.now() - 86400000 * 12,
},
{
  id: "mock-14",
  imgURL: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
  review: "“Si alguien me hubiera dicho que iba a shippear así, no les habría creído.”",
  userName: "Neko",
  createdAt: Date.now() - 86400000 * 13,
},
{
  id: "mock-15",
  imgURL: "https://cdn.myanimelist.net/images/anime/1000/110531.jpg",
  review: "“Lo terminé. Ahora estoy vacío. ¿Otro anime? Sí.”",
  userName: "Zero",
  createdAt: Date.now() - 86400000 * 14,
},
{
  id: "mock-16",
  imgURL: "https://cdn.myanimelist.net/images/anime/1286/135422.jpg",
  review: "“El capítulo 7 debería ser ilegal. Estoy destruido. 10/10.”",
  userName: "Aoi",
  createdAt: Date.now() - 86400000 * 15,
},
];

export default function mostrarHome() {
  const app = document.getElementById('app');
  if (!app) return console.error('No existe #app en el DOM');

  app.innerHTML = `
    <main>
      <h2>⭐ Últimos Animes Publicados</h2>
      <div id="postContainer" class="postContainer"></div>
    </main>
  `;

  const postContainer = document.getElementById('postContainer');

  const colRef = collection(db, 'posts');

  onSnapshot(colRef, (snapshot) => {
    const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    if (!docs.length) return renderPosts(MOCK_POSTS, postContainer, true);

    docs.sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt));

    renderPosts(docs, postContainer, false);

  }, (err) => {
    console.error('Error snapshot:', err);
    postContainer.innerHTML = `<p style="color:#900">Error cargando publicaciones.</p>`;
  });
}


// ------- NUEVAS FUNCIONES -------

async function validateImage(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

async function getBackupAnimeImage() {
  try {
    const res = await fetch("https://api.jikan.moe/v4/top/anime");
    const data = await res.json();
    const random = data.data[Math.floor(Math.random() * data.data.length)];
    return random.images.jpg.large_image_url;
  } catch {
    return "https://picsum.photos/seed/fallback/800/600";
  }
}

async function renderPosts(postsArray, container, isMock) {
  container.innerHTML = "";
  container.style.padding = "2rem";

  for (const p of postsArray) {
    const card = document.createElement("div");
    card.className = "post";

    let finalImg = p.imgURL;
    if (!(await validateImage(finalImg))) {
      finalImg = await getBackupAnimeImage();
    }

    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <div style="width:36px;height:36px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold;color:#005580">
          ${(p.userName?.[0] || "U").toUpperCase()}
        </div>
        <strong style="color:#005580">${p.userName || "Anon"}</strong>
        <small style="margin-left:auto;opacity:.7">${formatDate(p.createdAt)}</small>
      </div>
      <img src="${finalImg}" class="post-img"/>
      <p class="review">${escapeHtml(p.review || "")}</p>
    `;

    container.appendChild(card);
  }
}


function formatDate(createdAt) {
  const ms = timestampToMillis(createdAt);
  if (!ms) return "";
  return new Date(ms).toLocaleDateString();
}

function escapeHtml(str) {
  return str.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
