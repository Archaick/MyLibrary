// Initialize variables
const addBookLink = document.querySelector('.add-book');
const newBook = document.querySelector('#new-book');
const formContainer = document.querySelector('#container');
const form = document.querySelector('#form');
const closeButton = document.querySelector('#close-button');
const bookshelf = document.querySelector('.bookshelf');
const submitButton = document.getElementById('submit-btn');

// Initialize books array from local storage
let books = JSON.parse(localStorage.getItem("books")) || [];

// Variable to track if the form is open
let formOpen = false;
let isUpdateMode = false; // Track whether we are in Update mode
let editedIndex = -1; // Track the index of the book being edited

// Function to toggle the form's visibility
function toggleForm() {
    if (formOpen) {
        formContainer.classList.remove("active"); // Remove the "active" class
        newBook.style.transform = "rotate(0)";
        form.reset();
        formOpen = false;
        isUpdateMode = false; // Reset Update mode
        submitButton.value = "Submit"; // Reset the submit button text
        editedIndex = -1; // Reset the editedIndex
    } else {
        formContainer.classList.add("active"); // Add the "active" class
        newBook.style.transform = "rotate(45deg)";
        formOpen = true;
    }
}

// Event listeners for toggling the form
addBookLink.addEventListener("click", () => {
    toggleForm();
});

newBook.addEventListener("click", () => {
    toggleForm();
});

closeButton.addEventListener("click", () => {
    toggleForm();
});

// Function to create a book card
// Function to create a book card
function createBookCard(book, index) {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book");
    bookCard.setAttribute("data-index", index);

    const titleNode = document.createElement("h2");
    titleNode.innerHTML = `Title: <span class="user-input">${book.title}</span>`;

    const authorNode = document.createElement("h3");
    authorNode.innerHTML = `Author: <span class="user-input">${book.author}</span>`;

    const pageNode = document.createElement("h3");
    pageNode.innerHTML = `Pages: <span class="user-input">${book.pages}</span>`;

    const notesNode = document.createElement("h3");
    notesNode.innerHTML = `Notes: <span class="user-input">${book.notes}</span>`;

    // Create a div to wrap the "Check if read" label and checkbox
    const readDiv = document.createElement("div");
    readDiv.classList.add("read-div");

    // Label for the "Check if read" checkbox
    const readLabel = document.createElement("label");
    readLabel.textContent = "Check if read: ";

    // Create "Read" or "Not Read" checkbox
    const readCheckbox = document.createElement("input");
    readCheckbox.type = "checkbox";
    readCheckbox.checked = book.isRead; // Set the initial state
    // Adding class to the checkbox
    readCheckbox.classList.add("read-checkbox");

    readCheckbox.addEventListener("change", () => {
        // Update the book's read status when the checkbox is toggled
        book.isRead = readCheckbox.checked;
        localStorage.setItem("books", JSON.stringify(books)); // Update local storage
    });

    // Append elements to the readDiv
    readLabel.appendChild(readCheckbox);
    readDiv.appendChild(readLabel);

    // Create buttons for update and delete
    const updateNode = document.createElement("button");
    updateNode.classList = "update";
    updateNode.innerHTML = `Update <i class="fas fa-pen"></i>`;

    const trashNode = document.createElement("button");
    trashNode.classList = "trash";
    trashNode.innerHTML = `Delete <i class="fas fa-trash-alt">`;

    // Append elements to the bookCard
    bookCard.appendChild(titleNode);
    bookCard.appendChild(authorNode);
    bookCard.appendChild(pageNode);
    bookCard.appendChild(notesNode);
    bookCard.appendChild(readDiv); // Append the readDiv
    bookCard.appendChild(updateNode);
    bookCard.appendChild(trashNode);

    return bookCard;
}

// Function to display books
function displayBooks() {
    // Clear existing books
    bookshelf.innerHTML = '';

    // Loop through the books and display them
    books.forEach(function (book, i) {
        const bookCard = createBookCard(book, i);

        // Append the bookCard to the bookshelf
        bookshelf.appendChild(bookCard);
    });
}

// Function to add or update a book
function addOrUpdateBook(e) {
    e.preventDefault();

    // Get the form input values (title, author, pages, notes)
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const pages = document.getElementById("pages").value;
    const notes = document.getElementById("notes").value;

    if (!isUpdateMode) {
        // Create a new Book object
        const book = { title, author, pages, notes, isRead: false };

        // Add the book to the books array
        books.push(book);
    } else {
        // Update the existing book at the editedIndex
        const updatedBook = {
            title,
            author,
            pages,
            notes,
            isRead: books[editedIndex].isRead // Preserve the read status
        };
        books[editedIndex] = updatedBook;

        // Reset isUpdateMode
        isUpdateMode = false;

        // Reset the editedIndex
        editedIndex = -1;

        // Reset the submit button text
        submitButton.value = "Submit";
    }

    // Save the updated books array to local storage
    localStorage.setItem("books", JSON.stringify(books));

    // Display the updated list of books
    displayBooks();

    // Close the form
    toggleForm();
}

// Event listener for form submission
form.addEventListener("submit", addOrUpdateBook);

// Function to delete a book
function deleteBook(index) {
    // Remove the book from the books array
    books.splice(index, 1);

    // Save the updated books array to local storage
    localStorage.setItem("books", JSON.stringify(books));

    // Display the updated list of books
    displayBooks();
}

// Event delegation for deleting a book (listen for clicks on bookshelf)
bookshelf.addEventListener("click", (e) => {
    if (e.target.classList.contains("trash")) {
        const bookNode = e.target.parentElement;
        const index = bookNode.getAttribute("data-index");
        deleteBook(index);
    } else if (e.target.classList.contains("update")) {
        const bookNode = e.target.parentElement;
        const index = bookNode.getAttribute("data-index");
        editBook(index);
    }
});

// Function to edit a book
function editBook(index) {
    const book = books[index];
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("pages").value = book.pages;
    document.getElementById("notes").value = book.notes;

    // Open the modal
    toggleForm();

    // Set isUpdateMode to true
    isUpdateMode = true;

    // Set the editedIndex to the current index
    editedIndex = index;

    // Update the submit button text
    submitButton.value = "Update";
}

// Display books initially
displayBooks();
