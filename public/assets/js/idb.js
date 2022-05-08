// create variable to hold db connection
let db;
// -- IndexedDB database called 'pizza_hunt' and set it to version 1
// When the connection to the database is open, it's emitting an event that the 'request' variable will be able to capture
const request = window.indexedDB.open('pizza_hunt_kt', 1); // request variable to act as an event listener  

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
  // save a reference to the database 
  const db = event.target.result;
  // create an object-store (table) called `new_pizza` to hold the pizza data
  db.createObjectStore('new_pizza', { autoIncrement: true });   // auto incrementing index for each new set of data we insert
};

request.onsuccess = function(event){
  db = event.target.result;

  if(navigator.onLine){
    uploadPizza;
  }
};

request.onerror = function(event){
  console.log(event.target.errorCode);
}

// -- This function will be executed if we attempt to submit a new pizza and there's no internet connection

function saveRecordAtStorage(record) {
  // Explicitly  open a new transaction with the database with read and write permissions 
  const transaction = db.transaction(['new_pizza'], 'readwrite');
  const pizzaObjectStore = transaction.objectStore('new_pizza'); // access the object store for `new_pizza`
  pizzaObjectStore.add(record); // add record to your store with add method
}

function uploadPizza() {
  // Explicitly open a transaction on your db
  const transaction = db.transaction(['new_pizza'], 'readwrite');
  const pizzaObjectStore = transaction.objectStore('new_pizza');  // access your object store
  
  const getAll = pizzaObjectStore.getAll(); // get all records from store and set to a variable 

  // upon a successful .getAll() execution, run this function
  getAll.onsuccess = function() {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch('/api/pizzas', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open 1 more transaction to access the new_pizza object store in order to empty it.
          const transaction = db.transaction(['new_pizza'], 'readwrite');
          const pizzaObjectStore = transaction.objectStore('new_pizza');   // 
          pizzaObjectStore.clear(); // clear all items in your store

          alert('All saved pizza has been submitted!');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
} // end of uploadPizza method

// But what happens if the internet outage is temporary and it comes back one minute 
// after it saves to IndexedDB? What can the user do to trigger this uploadPizza() function?

// Ans: Add a browser event listener to check for a network status change, i.e. back online
 
window.addEventListener('online', uploadPizza);

 

