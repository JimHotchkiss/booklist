// Book Class: Represents a Book
class Book {
  // constructor runs when we instantiate a book
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const bookListID = document.querySelector("#book-list");

    // We now want to insert a table row into our table
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">&#10005;</a></td>
    `;

    bookListID.appendChild(row);
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    // insert the 'div' before the 'form'
    container.insertBefore(div, form);
    // Make alert vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      // We want to delete the row (tr)
      el.parentElement.parentElement.remove();
    }
  }
}

// Store Class: Handles Storage
class Store {
  // Get books
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  // Add books
  static addBooks(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  // Remove books
  static removeBooks(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a Book
document
  .getElementById("book-form")
  .addEventListener("submit", (submitEvent) => {
    // Prevent Submit
    submitEvent.preventDefault();

    // Get form value
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    // Validations
    if (title === "" || author === "" || isbn === "") {
      UI.showAlert("Please fill in all fields", "primary");
    } else {
      // Instantiate a Book with 'Book' Class
      const book = new Book(title, author, isbn);

      // Add to UI
      UI.addBookToList(book);
      // Add book to Store
      Store.addBooks(book);

      // Show success message
      UI.showAlert("Book added successfully", "success");

      // Clear fields
      UI.clearFields();
    }
  });

// Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", (clickEvent) => {
  // Remove book from UI
  UI.deleteBook(clickEvent.target);

  // Remove books from Store
  Store.removeBooks(
    clickEvent.target.parentElement.previousElementSibling.textContent
  );

  // Show success message
  UI.showAlert("Book removed successfully", "success");
});
