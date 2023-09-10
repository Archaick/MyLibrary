// Initialize variables
const addBookLink = document.querySelector('.add-book');
const newBook = document.querySelector('#new-book');
const formContainer = document.querySelector('#container');
const form = document.querySelector('#form');
const closeButton = document.querySelector('#close-button');
const bookshelf = document.querySelector('.bookshelf');

// Initialize books array from local storage
let books = JSON.parse(localStorage.getItem("books")) || [];

// Variable to track if the form is open
let formOpen = false;

// Check if there are any existing books in local storage
if (books.length > 0) {
    displayBooks();
}

// Function to toggle the form's visibility
function toggleForm() {
    if (formOpen) {
        formContainer.classList.remove("active"); // Remove the "active" class
        newBook.style.transform = "rotate(0)";
        form.reset();
        formOpen = false;
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

// Function to display books
function displayBooks() {
    // Clear existing books
    bookshelf.innerHTML = '';

    // Loop through the books and display them
    books.forEach(function (book, i) {
        let bookNode = document.createElement("div");
        bookNode.classList.add("book");
        bookNode.setAttribute("data-index", `${i}`);

        const titleNode = document.createElement("h2");
        titleNode.innerHTML = `Title: <span class="user-input">${book.title}</span>`;
    
        const authorNode = document.createElement("h3");
        authorNode.innerHTML = `Author: <span class="user-input">${book.author}</span>`;
    
        const pageNode = document.createElement("h3");
        pageNode.innerHTML = `Pages: <span class="user-input">${book.pages}</span>`;
    
        const notesNode = document.createElement("h3");
        notesNode.innerHTML = `Notes: <span class="user-input">${book.notes}</span>`;

        // Create buttons for update and delete
        const updateNode = document.createElement("button");
        updateNode.classList = "update";
        updateNode.innerHTML = `Update <i class="fas fa-pen"></i>`;

        const trashNode = document.createElement("button");
        trashNode.classList = "trash";
        trashNode.innerHTML = `Delete <i class="fas fa-trash-alt">`;

        // Append elements to the bookNode
        bookNode.appendChild(titleNode);
        bookNode.appendChild(authorNode);
        bookNode.appendChild(pageNode);
        bookNode.appendChild(notesNode);
        bookNode.appendChild(updateNode);
        bookNode.appendChild(trashNode);

        // Append the bookNode to the bookshelf
        bookshelf.appendChild(bookNode);
    });
}

// Function to add a book
function addBook(e) {
    e.preventDefault();

    // Get the form input values (title, author, pages, notes)
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const pages = document.getElementById("pages").value;
    const notes = document.getElementById("notes").value;

    // Create a new Book object
    const book = { title, author, pages, notes };

    // Add the book to the books array
    books.push(book);

    // Save the updated books array to local storage
    localStorage.setItem("books", JSON.stringify(books));

    // Display the updated list of books
    displayBooks();

    // Close the form
    toggleForm();
}

// Event listener for form submission
form.addEventListener("submit", addBook);

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
    }
});
