let baseUrl = "https://openlibrary.org/search.json?title=";

let searchBook = async function () {
    let bookName = document.querySelector('.book-name').value.trim();
    if (!bookName) {
        alert('Please enter a book name');
        return;
    }

    // Show loading indicator
    let loadingIndicator = document.querySelector('.loading');
    loadingIndicator.style.display = 'block';

    try {
        let res = await fetch(baseUrl + encodeURIComponent(bookName));
        let data = await res.json();

        // Clear previous results
        let container = document.querySelector('.books-container');
        container.innerHTML = '';

        if (data.docs && data.docs.length > 0) {
            // Use a Set to track unique books based on title and authors
            let uniqueBooks = new Set();

            for (let i = 0; i < data.docs.length; i++) {
                let book = data.docs[i];
                let title = book.title;
                let authors = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
                let coverId = book.cover_i;
                let genre = book.subject ? book.subject[0] : 'Unknown Genre';

                // Check for unique book (title and authors combination)
                let bookKey =`${title} by ${authors}`; // Unique key for each book

                // Skip the book if it doesn't have a cover image or if it's already been displayed
                if (!coverId || uniqueBooks.has(bookKey)) continue;

                // Add the book to the set of displayed books
                uniqueBooks.add(bookKey);

                // Create book item element
                let bookItem = document.createElement('div');
                bookItem.classList.add('book-item');
                bookItem.innerHTML = `
                    <img class="book-cover" src="https://covers.openlibrary.org/b/id/${coverId}-L.jpg" alt="${title}" />
                    <h2 class="book-title">Title: ${title}</h2>
                    <p class="author-name">Author: ${authors}</p>
                    <p class="book-genre">Genre: ${genre}</p>
                `;

                // Append book item to the container
                container.appendChild(bookItem);
            }

            if (uniqueBooks.size === 0) {
                alert('No unique books with cover images found for the given name');
            }
        } else {
            alert('No books found for the given name');
        }
    } catch (error) {
        console.log("Error fetching book data:", error);
        alert('An error occurred while fetching the book details.');
    } finally {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
    }
}

// Attach the search function to the button click
document.querySelector('.search').addEventListener('click', searchBook);

document.querySelector('.close-button').addEventListener('click', clearSearch);

// Define the clearSearch function
function clearSearch() {
    document.querySelector('.book-name').value = '';
    document.querySelector('.books-container').innerHTML = '';
}

// Add event listener for Enter key press in the book name input field
document.querySelector('.book-name').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchBook();
    }
});

