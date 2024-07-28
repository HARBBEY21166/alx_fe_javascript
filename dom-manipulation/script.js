let localQuotes = [];

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(localQuotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    localQuotes = JSON.parse(storedQuotes);
  }
}

function syncQuotes() {
  // TO DO: implement syncing with server
  console.log('Syncing quotes with server...');
}

function createAddQuoteForm() {
  const addQuoteFormElement = document.getElementById('add-quote-form');
  addQuoteFormElement.innerHTML = '';

  const formHTML = `
    <label for="quote-content">Quote:</label>
    <input type="text" id="quote-content" name="quote-content"><br><br>
    <label for="quote-category">Category:</label>
    <input type="text" id="quote-category" name="quote-category"><br><br>
    <input type="button" value="Add Quote" id="add-quote-button">
  `;

  addQuoteFormElement.innerHTML = formHTML;

  const addQuoteButtonElement = document.getElementById('add-quote-button');
  addQuoteButtonElement.addEventListener('click', addQuote);
}

function addQuote() {
  const quoteContentElement = document.getElementById('quote-content');
  const quoteCategoryElement = document.getElementById('quote-category');

  const newQuote = {
    id: localQuotes.length + 1,
    content: quoteContentElement.value,
    category: quoteCategoryElement.value
  };

  localQuotes.push(newQuote);
  saveQuotes();
  syncQuotes();

  quoteContentElement.value = '';
  quoteCategoryElement.value = '';
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showRandomQuote() {
  const quoteListElement = document.getElementById('quote-list');
  quoteListElement.innerHTML = '';

  if (localQuotes.length > 0) {
    const randomIndex = random(0, localQuotes.length - 1);
    const randomQuote = localQuotes[randomIndex];
    const quoteElement = document.createElement('li');
    quoteElement.textContent = randomQuote.content;
    quoteListElement.appendChild(quoteElement);
  } else {
    quoteListElement.textContent = 'No quotes available.';
  }
}

loadQuotes();
createAddQuoteForm();
showRandomQuote();

setInterval(showRandomQuote, 10000);
