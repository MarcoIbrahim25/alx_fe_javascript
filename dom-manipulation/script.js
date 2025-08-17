const STORAGE_KEY = "quotes_json_v1";
const SELECTED_CATEGORY_KEY = "selectedCategory";
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

const quotesDefault = [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "What gets measured gets managed.", category: "Productivity" },
  { text: "Knowledge is power.", category: "General" },
];

let quotes = loadQuotes();

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");
const syncNowBtn = document.getElementById("syncNow");

function loadQuotes() {
  const s = localStorage.getItem(STORAGE_KEY);
  try {
    return s ? JSON.parse(s) : quotesDefault.slice();
  } catch {
    return quotesDefault.slice();
  }
}

function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

function escapeHTML(s) {
  const d = document.createElement("div");
  d.textContent = s || "";
  return d.innerHTML;
}

function populateCategories() {
  if (!categoryFilter) return;
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  const cats = Array.from(
    new Set(quotes.map((q) => (q.category || "General").trim()).filter(Boolean))
  ).sort();
  cats.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    categoryFilter.appendChild(opt);
  });
  const saved = localStorage.getItem(SELECTED_CATEGORY_KEY);
  if (saved && (saved === "all" || cats.includes(saved)))
    categoryFilter.value = saved;
}

function displayRandomQuoteFromPool(pool) {
  if (!pool.length) {
    quoteDisplay.innerHTML = `<p>No quotes for this category.</p>`;
    return;
  }
  const q = pool[Math.floor(Math.random() * pool.length)];
  const t = escapeHTML(q.text);
  const c = escapeHTML(q.category || "General");
  quoteDisplay.innerHTML = `<blockquote><p>${t}</p><small>#${c}</small></blockquote>`;
}

function filterQuotes() {
  const selectedCategory = categoryFilter ? categoryFilter.value : "all";
  localStorage.setItem(SELECTED_CATEGORY_KEY, selectedCategory);
  const pool =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(
          (q) =>
            (q.category || "General").trim().toLowerCase() ===
            selectedCategory.trim().toLowerCase()
        );
  displayRandomQuoteFromPool(pool);
}

function displayRandomQuote() {
  filterQuotes();
}
function showRandomQuote() {
  filterQuotes();
}

function createAddQuoteForm() {
  const box = document.createElement("div");
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";
  const catInput = document.createElement("input");
  catInput.type = "text";
  catInput.placeholder = "Enter quote category";
  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", async () => {
    const t = (textInput.value || "").trim();
    const c = (catInput.value || "").trim() || "General";
    if (t.length < 3) return;
    const before = new Set(quotes.map((q) => (q.category || "General").trim()));
    const newQ = { text: t, category: c };
    quotes.push(newQ);
    saveQuotes();
    const after = new Set(quotes.map((q) => (q.category || "General").trim()));
    if (after.size !== before.size) populateCategories();
    textInput.value = "";
    catInput.value = "";
    filterQuotes();
    await postQuoteToServer(newQ);
  });
  box.appendChild(textInput);
  box.appendChild(catInput);
  box.appendChild(addBtn);
  document.body.appendChild(box);
}

async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: quote.text, body: quote.category }),
    });
  } catch (_) {}
}

async function fetchQuotesFromServer() {
  const res = await fetch(`${SERVER_URL}?_limit=5`);
  const data = await res.json();
  return data.map((it) => ({ text: it.title, category: "Server" }));
}

function resolveConflictsServerWins(localArr, serverArr) {
  const localMap = new Map(
    localArr.map((q) => [q.text.trim().toLowerCase(), q])
  );
  const serverMap = new Map(
    serverArr.map((q) => [q.text.trim().toLowerCase(), q])
  );
  let added = 0,
    conflicts = 0;
  serverMap.forEach((srvQ, key) => {
    const locQ = localMap.get(key);
    if (!locQ) {
      localArr.push(srvQ);
      added++;
    } else if ((locQ.category || "General") !== (srvQ.category || "General")) {
      locQ.category = srvQ.category;
      conflicts++;
    }
  });
  return { added, conflicts };
}

function setStatus(msg) {
  if (syncStatus) syncStatus.innerHTML = msg || "";
}

async function syncQuotes() {
  try {
    setStatus("Syncing...");
    const serverQuotes = await fetchQuotesFromServer();
    const before = new Set(quotes.map((q) => (q.category || "General").trim()));
    const result = resolveConflictsServerWins(quotes, serverQuotes);
    saveQuotes();
    const after = new Set(quotes.map((q) => (q.category || "General").trim()));
    if (after.size !== before.size) populateCategories();
    filterQuotes();
    setStatus(
      `Synced. Added: ${result.added}, Conflicts resolved: ${result.conflicts}`
    );
    alert("Quotes synced with server!");
    setTimeout(() => setStatus(""), 3000);
  } catch (_) {
    setStatus("Sync failed");
    setTimeout(() => setStatus(""), 3000);
  }
}

createAddQuoteForm();
populateCategories();
filterQuotes();
newQuoteBtn.addEventListener("click", showRandomQuote);
if (syncNowBtn) syncNowBtn.addEventListener("click", syncQuotes);
setInterval(syncQuotes, 15000);
