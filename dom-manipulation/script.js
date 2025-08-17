const STORAGE_KEY = "quotes_json_v1";
const LAST_FILTER_KEY = "last_category_filter_v1";

const quotesDefault = [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "What gets measured gets managed.", category: "Productivity" },
  { text: "Knowledge is power.", category: "General" },
];

let quotes = loadQuotes();

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

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
  const saved = localStorage.getItem(LAST_FILTER_KEY);
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
  const sel = categoryFilter.value;
  localStorage.setItem(LAST_FILTER_KEY, sel);
  const pool =
    sel === "all"
      ? quotes
      : quotes.filter(
          (q) =>
            (q.category || "General").trim().toLowerCase() ===
            sel.trim().toLowerCase()
        );
  displayRandomQuoteFromPool(pool);
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
  addBtn.addEventListener("click", () => {
    const t = (textInput.value || "").trim();
    const c = (catInput.value || "").trim() || "General";
    if (t.length < 3) return;
    const before = new Set(quotes.map((q) => (q.category || "General").trim()));
    quotes.push({ text: t, category: c });
    saveQuotes();
    const after = new Set(quotes.map((q) => (q.category || "General").trim()));
    if (after.size !== before.size) populateCategories();
    textInput.value = "";
    catInput.value = "";
    filterQuotes();
  });
  box.appendChild(textInput);
  box.appendChild(catInput);
  box.appendChild(addBtn);
  document.body.appendChild(box);
}

createAddQuoteForm();
populateCategories();
filterQuotes();
newQuoteBtn.addEventListener("click", showRandomQuote);
