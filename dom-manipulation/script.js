let quotes = [];
let lastViewedQuote = null;
let lastSelectedFilter = null;

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes!== null) {
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
  if (storedLastViewedQuote!== null) {
    lastViewedQuote = JSON.parse(storedLastViewedQuote);
  } else {
    lastViewedQuote = null;
  }
}

function saveLastViewedQuote() {
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(lastViewedQuote));
}

function loadLastSelectedFilter() {
  const storedLastSelectedFilter = localStorage.getItem("lastSelectedFilter");
  if (storedLastSelectedFilter!== null) {
    lastSelectedFilter = storedLastSelectedFilter;
  } else {
    lastSelectedFilter = "all";
  }
}

function saveLastSelectedFilter() {
  localStorage.setItem("lastSelectedFilter", lastSelectedFilter);
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  updateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  filterQuotes();
}

function updateCategories() {
  const categories = quotes.map(quote => quote.category);
  const uniqueCategories = [...new Set(categories)];
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = "";
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.text = "All Categories";
  categoryFilter.appendChild(allOption);
  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.text = category;
    categoryFilter.appendChild(option);
  });
}

function populateCategories() {
  updateCategories();
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.value = lastSelectedFilter;
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  lastSelectedFilter = selectedCategory;
  saveLastSelectedFilter();
  const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory || selectedCategory === "all");
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";
  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement("p");
    quoteElement.textContent = `"${quote.text}" - ${quote.category}`;
    quoteDisplay.appendChild(quoteElement);
  });
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
    updateCategories();
    filterQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

function init() {
  loadQuotes();
  loadLastViewedQuote();
  loadLastSelectedFilter();
  populateCategories();
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("exportButton").addEventListener("click", exportToJson);
  document.getElementById("importButton").addEventListener("change", importFromJsonFile);
  filterQuotes();
}

init();
