const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;


    const doesExist = (username)=>{
        let userswithsamename = users.filter((user)=>{
            return user.username === username
        });
        if(userswithsamename.length > 0){
            return true;
        } else {
            return false;
        }
    }
  
    if (username && password) {
        if (!doesExist(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   return res.send(JSON.stringify(books, null, 4));
// });


// Get the book list available in the shop with async/await 
public_users.get('/',async function (req, res) {
    try {
        const bookData = await readFile('./router/booksdb.js', 'utf8');
        const books = eval(bookData);
        res.send(JSON.stringify(books, null, 4));
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Server Error` });
    }
});


// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//     const isbn = req.params.isbn;
//     return res.send(books[isbn]);
// });

// Get book details based on ISBN with async/await
public_users.get('/isbn/:isbn',async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const bookData = await readFile('./router/booksdb.js', 'utf8');
        const books = eval(bookData);

        if(books[isbn]) {
            return res.send(books[isbn]);
        } else {
            res.status(404).json({ message: `The book with ISBN ${isbn} doesn't exist.` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Server error.` });
    }
});
  
// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//     const author = req.params.author;
//     const filtered_author = Object.values(books).filter(book => book.author === author);
//     res.send({booksbyauthor: filtered_author});
// });

// Get book details based on author with async/await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const bookData = await readFile('./router/booksdb.js', 'utf8');
        const books = eval(bookData);
        const filtered_author = Object.values(books).filter(book => book.author === author);
        res.send({booksbyauthor: filtered_author});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Server error.` });
    }
});

// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//     const title = req.params.title;
//     const filtered_title = Object.values(books).filter(book => book.title === title);
//     res.send({booksbytitle: filtered_title});
// });

// Get all books based on title with async/await
public_users.get('/title/:title',async function (req, res) {
    const title = req.params.title;
    try {
        const bookData = await readFile('./router/booksdb.js', 'utf8');
        const books = eval(bookData);
        const filtered_title = Object.values(books).filter(book => book.title === title);
        res.send({booksbytitle: filtered_title});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Server error.` });
    }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const review = books[isbn].reviews;
    return res.send({review});
});

module.exports.general = public_users;
