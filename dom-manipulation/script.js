let localQuotes = [];
let selectedCategory = 'All';

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
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/sync', true);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log('Quotes synced with server!');
    } else {
      console.error('Error syncing quotes with server:', xhr.statusText);
    }
  };

  const quotesBlob = new Blob([JSON.stringify(localQuotes)], { type: 'application/json' });
  xhr.send(quotesBlob);
}

function createAddQuoteForm() {
  const addQuoteFormElement = document.getElementById('add-quote-form');
  addQuoteFormElement.innerHTML = '';

  const formHTML = `
    <label for="quote-content">Quote:</label>
    <input type="text" id="quote-content" name="quote-content"><br><br>
    <label for="quote-category">Category:</label>
    <select id="quote-category" name="quote-category"></select><br><br>
    <input type="button" value="Add Quote" id="add-quote-button">
    <input type="file" id="quote-file" name="quote-file">
  `;

  addQuoteFormElement.innerHTML = formHTML;

  const addQuoteButtonElement = document.getElementById('add-quote-button');
  addQuoteButtonElement.addEventListener('click', addQuote);

  const quoteFileElement = document.getElementById('quote-file');
  quoteFileElement.addEventListener('change', handleFileChange);

  populateCategories();
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

function handleFileChange(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function() {
    const fileContent = reader.result;
    const quotesFromFile = JSON.parse(fileContent);
    localQuotes = localQuotes.concat(quotesFromFile);
    saveQuotes();
    syncQuotes();
  };
  reader.readAsText(file);
}

function populateCategories() {
  const categorySelectElement = document.getElementById('quote-category');
  const categories = [...new Set(localQuotes.map(quote => quote.category))];
  categories.forEach(category => {
    const optionElement = document.createElement('option');
    optionElement.textContent = category;
    categorySelectElement.appendChild(optionElement);
  });
}

function categoryFilter(category) {
  return localQuotes.filter(quote => quote.category === category);
}

function filterQuote(category) {
  selectedCategory = category;
  const filteredQuotes = categoryFilter(category);
  quoteDisplay(filteredQuotes);
}

function quoteDisplay(quotes) {
  const quoteListElement = document.getElementById('quote-list');
  quoteListElement.innerHTML = '';

  quotes.forEach(quote => {
    const quoteElement = document.createElement('li');
    quoteElement.textContent = quote.content;
    quoteListElement.appendChild(quoteElement);
  });
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

function fetchQuotesFromServer() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/quotes', true);

  xhr.onload = function() {
    if (xhr.status === 200) {
      const quotesFromServer = JSON.parse(xhr.responseText);
      localQuotes = quotesFromServer;
      saveQuotes();
      filterQuote(selectedCategory);
    } else {
      console.error('Error fetching quotes from server:', xhr.statusText);
    }
  };

  xhr.send();
}

let localQuotes = [];
let selectedCategory = 'All';

async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts.json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const quotesFromServer = await response.json();
    localQuotes = quotesFromServer;
    saveQuotes();
    filterQuote(selectedCategory);
  } catch (error) {
    alert('Error fetching quotes from server:');
    console.error('Error fetching quotes from server:', error);
  }
}


loadQuotes();
createAddQuoteForm();
fetchQuotesFromServer(); // fetch quotes from server on page load
showRandomQuote();

setInterval(showRandomQuote, 10000);
