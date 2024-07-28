// quotes array to store quote objects
let quotes = [];

// function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes !== null) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "Believe you can and you're halfway there.", category: "Motivation" },
      { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
      { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
    ];
  }
}

// function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p>Category: ${randomQuote.category}</p>
    <p>Quote: ${randomQuote.text}</p>
  `;
}

// function to create and display the add quote form
function createAddQuoteForm() {
  const addQuoteForm = document.createElement("div");
  addQuoteForm.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
  document.body.appendChild(addQuoteForm);
}

// function to add a new quote to the quotes array and update local storage
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  if (newQuoteText !== "" && newQuoteCategory !== "") {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    showRandomQuote();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both quote and category");
  }
}

// function to export quotes to a JSON file
function exportToJson() {
  const jsonQuotes = JSON.stringify(quotes);
  const blob = new Blob([jsonQuotes], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
}

// function to import quotes from a JSON file
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

// load quotes from local storage
loadQuotes();

// create and display the add quote form
createAddQuoteForm();

// display a random quote on page load
showRandomQuote();

// add event listener to the new quote button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// add event listener to the export button
document.getElementById("exportButton").addEventListener("click", exportToJson);

// add event listener to the import file input
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
