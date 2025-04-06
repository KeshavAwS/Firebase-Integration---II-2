// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const novelsRef = collection(db, "novels");

// Elements
const tableBody = document.getElementById("novelTableBody");
const yearFilter = document.getElementById("yearFilter");
const sortPrice = document.getElementById("sortPrice");
const searchInput = document.getElementById("searchInput");

// Fetch and render novels
async function fetchAndRender() {
  let q = novelsRef;

  // Filters
  const selectedYear = yearFilter.value;
  const priceSort = sortPrice.value;
  const searchTerm = searchInput.value.toLowerCase();

  let constraints = [];

  if (selectedYear) {
    constraints.push(where("release_year", "==", parseInt(selectedYear)));
  }

  if (priceSort) {
    constraints.push(orderBy("price", priceSort));
  }

  if (constraints.length > 0) {
    q = query(novelsRef, ...constraints);
  }

  const snapshot = await getDocs(q);

  let novels = [];
  snapshot.forEach(doc => novels.push({ id: doc.id, ...doc.data() }));

  // Client-side search filter
  if (searchTerm) {
    novels = novels.filter(novel =>
      novel.title.toLowerCase().includes(searchTerm) ||
      novel.author.toLowerCase().includes(searchTerm)
    );
  }

  renderTable(novels);
}

// Render novels to table
function renderTable(novels) {
  tableBody.innerHTML = "";
  novels.forEach(novel => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${novel.title}</td>
      <td>${novel.author}</td>
      <td>$${novel.price.toFixed(2)}</td>
      <td>${novel.release_year}</td>
      <td>${novel.genre}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Event Listeners
yearFilter.addEventListener("change", fetchAndRender);
sortPrice.addEventListener("change", fetchAndRender);
searchInput.addEventListener("input", fetchAndRender);

// Initial render
fetchAndRender();
