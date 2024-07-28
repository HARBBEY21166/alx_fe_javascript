// Step 1: Simulate Server Interaction
const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

let localQuotes = [];
let serverQuotes = [];

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    serverQuotes = data;
    syncData();
  } catch (error) {
    console.error('Error fetching quotes:', error);
  }
}

async function sendQuoteToServer(quote) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    });
    const data = await response.json();
    console.log('Quote sent to server:', data);
  } catch (error) {
    console.error('Error sending quote to server:', error);
  }
}

async function syncQuotes() {
  // Sync local quotes with server quotes
  for (const localQuote of localQuotes) {
    const serverQuote = serverQuotes.find(quote => quote.id === localQuote.id);
    if (serverQuote) {
      // Update local quote with server quote
      localQuote.content = serverQuote.content;
    } else {
      // Send local quote to server
      await sendQuoteToServer(localQuote);
    }
  }
}

function saveQuotes() {
  // Save local quotes to local storage
  localStorage.setItem('localQuotes', JSON.stringify(localQuotes));
}

setInterval(fetchQuotesFromServer, 10000); // fetch data every 10 seconds

// Step 2: Implement Data Syncing
function syncData() {
  const localQuoteIds = localQuotes.map(quote => quote.id);
  const serverQuoteIds = serverQuotes.map(quote => quote.id);

  // Check for new quotes from the server
  const newQuotes = serverQuotes.filter(quote =>!localQuoteIds.includes(quote.id));
  localQuotes.push(...newQuotes);

  // Check for updated quotes from the server
  const updatedQuotes = serverQuotes.filter(quote => localQuoteIds.includes(quote.id));
  updatedQuotes.forEach(quote => {
    const localQuoteIndex = localQuotes.findIndex(localQuote => localQuote.id === quote.id);
    if (localQuoteIndex!== -1) {
      localQuotes[localQuoteIndex] = quote;
    }
  });

  // Check for deleted quotes from the server
  const deletedQuoteIds = localQuoteIds.filter(id =>!serverQuoteIds.includes(id));
  localQuotes = localQuotes.filter(quote =>!deletedQuoteIds.includes(quote.id));

  // Save local quotes to storage
  saveQuotes();

  // Notify user of updates
  notifyUserOfUpdates();

  // Sync local quotes with server quotes
  syncQuotes();
}

// Step 3: Handling Conflicts
function notifyUserOfUpdates() {
  const notificationElement = document.getElementById('notification');
  notificationElement.textContent = 'Data has been updated!';
  notificationElement.style.display = 'block';

  // Provide an option for users to manually resolve conflicts
  const conflictResolutionButton = document.getElementById('conflict-resolution-button');
  conflictResolutionButton.style.display = 'block';
}

function manualConflictResolution() {
  // Implement manual conflict resolution logic here
  console.log('Manual conflict resolution triggered');
}

// Step 4: Testing and Verification
function testSyncAndConflictResolution() {
  // Test syncing and conflict resolution logic here
  console.log('Testing sync and conflict resolution...');

  // Test sending a quote to the server
  const testQuote = { id: 1, content: 'Test quote' };
  sendQuoteToServer(testQuote);
}

testSyncAndConflictResolution();
