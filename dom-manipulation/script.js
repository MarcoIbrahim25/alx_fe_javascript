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
  const t = escapeHTML(q.text || "");
  const c = escapeHTML(q.category || "General");
  quoteDisplay.innerHTML = `<blockquote><p>${t}</p><small>#${c}</small></blockquote>`;
}

function showRandomQuote() {
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
    textInput.value = "";
    catInput.value = "";
    showRandomQuote();
  });
  box.appendChild(textInput);
  box.appendChild(catInput);
  box.appendChild(addBtn);
  document.body.appendChild(box);
}

createAddQuoteForm();
showRandomQuote();
newQuoteBtn.addEventListener("click", showRandomQuote);
