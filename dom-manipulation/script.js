let quotes = [];
let lastViewedQuote = null;

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes !== null) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [];
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadLastViewedQuote() {
  const storedLastViewedQuote = sessionStorage.getItem("lastViewedQuote");
  if (storedLastViewedQuote !== null) {
    lastViewedQuote = JSON.parse(storedLastViewedQuote);
  } else {
    lastViewedQuote = null;
  }
}

function saveLastViewedQuote() {
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(lastViewedQuote));
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
  lastViewedQuote = randomQuote;
  saveLastViewedQuote();
}

function exportToJson() {
  const jsonQuotes = JSON.stringify(quotes);
  const blob = new Blob([jsonQuotes], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

loadQuotes();
loadLastViewedQuote();
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportButton").addEventListener("click", exportToJson);
