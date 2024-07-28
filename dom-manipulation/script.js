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

setInterval(fetchQuotesFromServer, 10000); // fetch data every 10 seconds

// Step 2: Implement Data Syncing
function syncData() {
  const localQuoteIds = localQuotes.map(quote => quote.id);
  const serverQuoteIds = serverQuotes.map(quote => quote.id);

  // Check for new quotes from the server
  const newQuotes = serverQuotes.filter(quote => !localQuoteIds.includes(quote.id));
  localQuotes.push(...newQuotes);

  // Check for updated quotes from the server
  const updatedQuotes = serverQuotes.filter(quote => localQuoteIds.includes(quote.id));
  updatedQuotes.forEach(quote => {
    const localQuoteIndex = localQuotes.findIndex(localQuote => localQuote.id === quote.id);
    if (localQuoteIndex !== -1) {
      localQuotes[localQuoteIndex] = quote;
    }
  });

  // Check for deleted quotes from the server
  const deletedQuoteIds = localQuoteIds.filter(id => !serverQuoteIds.includes(id));
  localQuotes = localQuotes.filter(quote => !deletedQuoteIds.includes(quote.id));

  // Save local quotes to storage
  saveQuotes();

  // Notify user of updates
  notifyUserOfUpdates();
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
}

testSyncAndConflictResolution();
