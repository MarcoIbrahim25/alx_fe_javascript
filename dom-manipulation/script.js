const quotes = [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "What gets measured gets managed.", category: "Productivity" },
  { text: "Knowledge is power.", category: "General" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

function showRandomQuote() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  quoteDisplay.textContent = `${q.text}  (#${q.category})`;
}

function createAddForm() {
  const wrap = document.createElement("div");
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";
  const catInput = document.createElement("input");
  catInput.type = "text";
  catInput.placeholder = "Enter category";
  const addBtn = document.createElement("button");
  addBtn.textContent = "Add";
  addBtn.onclick = () => {
    const t = (textInput.value || "").trim();
    const c = (catInput.value || "").trim() || "General";
    if (t.length < 3) return;
    quotes.push({ text: t, category: c });
    textInput.value = "";
    catInput.value = "";
    showRandomQuote();
  };
  wrap.append(textInput, catInput, addBtn);
  document.body.insertBefore(wrap, newQuoteBtn);
}

createAddForm();
showRandomQuote();
newQuoteBtn.addEventListener("click", showRandomQuote);
