const STORAGE_KEY = "quotes_json_v1";

const quotesDefault = [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "What gets measured gets managed.", category: "Productivity" },
  { text: "Knowledge is power.", category: "General" },
];

let quotes = loadQuotes();

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportBtn");

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

function displayRandomQuote() {
  let q = null;
  const last = sessionStorage.getItem("lastQuote");
  if (last) q = JSON.parse(last);
  else q = quotes[Math.floor(Math.random() * quotes.length)];
  const t = escapeHTML(q.text);
  const c = escapeHTML(q.category || "General");
  quoteDisplay.innerHTML = `<blockquote><p>${t}</p><small>#${c}</small></blockquote>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(q));
}

function showRandomQuote() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  sessionStorage.setItem("lastQuote", JSON.stringify(q));
  displayRandomQuote();
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
    quotes.push({ text: t, category: c });
    saveQuotes();
    textInput.value = "";
    catInput.value = "";
    showRandomQuote();
  });
  box.appendChild(textInput);
  box.appendChild(catInput);
  box.appendChild(addBtn);
  document.body.appendChild(box);
}

function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result || "[]");
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
    showRandomQuote();
  };
  fileReader.readAsText(event.target.files[0]);
}

createAddQuoteForm();
displayRandomQuote();
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportToJson);
