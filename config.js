/** Common config for bookstore. */


if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql://postgres:myPassword@localhost:5432/books_test"; //database for the testing
} else {
  DB_URI = "postgresql://postgres:myPassword@localhost:5432/books";//usersdb";  //database for main application
}

module.exports = { DB_URI };