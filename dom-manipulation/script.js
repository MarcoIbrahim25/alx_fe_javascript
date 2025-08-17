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
  quoteDisplay.innerHTML = `<blockquote><p>${escapeHTML(q.text)}</p><small>#${
    q.category || "General"
  }</small></blockquote>`;
}

function createAddQuoteForm() {
  const box = document.createElement("div");
  box.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote">
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category">
    <button id="addQuoteBtn">Add Quote</button>
  `;
  document.body.insertBefore(box, newQuoteBtn);
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
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
  displayRandomQuote();
}

createAddQuoteForm();
displayRandomQuote();
newQuoteBtn.addEventListener("click", displayRandomQuote);
