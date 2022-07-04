process.env.NODE_ENV ="test";

const request = require("supertest");

const app = require("..app");
const db = require("..db");

// isbn for a sample book

let book_isbn;

beforeEach(async() => {
    let result = await db.query(`
    INSERT INTO 
    books(isbn,amazon_url,author,language,pages,publisher,title,year)
    VALUES
    ('978-0-321-87758-1',
    'https://www.amazon.com/dp/0321125851',
    'J.R.R. Tolkien',
    'English',
    '1288',
    'Allen & Unwin',
    'The Lord of the Rings','1954')
    RETURNING isbn`);

    book_isbn = result.rows[0].isbn;
});

describe("POST/books" , function(){
    test("Creates a new book", async function(){
        const response = await request(app)
        .post(`/books`)
        .send({
            isbn: "32794782",
            amazon_url: "https://www.amazon.com/dp/0321125851",
            author: "mctest",
            language: "English",
            pages : 1000,
            publisher: "any publisher",
            title: "test book",
            year :2000
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.book.isbn).toHaveProperty("isbn");
    });
    test("Prevents creating book without required title", async function(){
        const response = await request(app)
            .post(`/books`)
            .send({ year: 2000 });
        expect(response.statusCode).toBe(400);
    });
});

describe("GET/books" , function(){
    test("Gets a list of 1 book" , async function(){
        const response = await request(app).get(`/books`);
        const books = response.body.books;
        expect(books).toHaveLength(1);
        expect(books[0]).toHaveProperty("isbn");
        expect(books[0]).toHaveProperty("amazon_url");

    });
    describe("GET/books/:isbn", function(){
        test("Gets a single book" , async function(){
            const response = await request(app)
                 .get(`/books/${book_isbn}`)
            expect(response.body.book).toHaveProperty("isbn");
            expect(response.body.book.isbn).toBe(book_isbn);
        });

        test("Responds with 404 if can't find book in question", async function(){
            const response = await request(app)
                .get(`/books/123456789`);
            expect(response.statusCode).toBe(404);
        });
    });

    d
});