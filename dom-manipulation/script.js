const quotes = [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "What gets measured gets managed.", category: "Productivity" },
  { text: "Knowledge is power.", category: "General" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

function escapeHTML(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function displayRandomQuote() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  const text = escapeHTML(q.text || "");
  const cat = escapeHTML(q.category || "General");
  quoteDisplay.innerHTML = `<blockquote><p>${text}</p><small>#${cat}</small></blockquote>`;
}

function showRandomQuote() {
  displayRandomQuote();
}

function createAddQuoteForm() {
  const box = document.createElement("div");
  box.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote">
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category">
    <button id="addQuoteBtn" onclick="addQuote()">Add Quote</button>
  `;
  document.body.insertBefore(box, newQuoteBtn);
}

function addQuote() {
  const t = (document.getElementById("newQuoteText").value || "").trim();
  const c =
    (document.getElementById("newQuoteCategory").value || "").trim() ||
    "General";
  if (t.length < 3) return;
  quotes.push({ text: t, category: c });
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  showRandomQuote();
}

createAddQuoteForm();
showRandomQuote();
newQuoteBtn.addEventListener("click", showRandomQuote);
