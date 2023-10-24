const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
        req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;
  
    // Check if the book with the provided ISBN exists
    if(books[isbn]) {
       
        books[isbn].reviews[username] = review;
        
        return res.status(200).json({ message: `The Review for the book with ISBN ${isbn} has been added/updated.` });
    } else {
        return res.status(404).json({ message: "Book with provided ISBN not found" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    
    if(books[isbn]) {
        if(books[isbn].reviews) {
            const userReview = books[isbn].reviews[username];
            if(userReview) {
                delete books[isbn].reviews[username];
                return res.status(200).json({message: `Review for the book with ISBN ${isbn} by the user ${username} deleted.` });
            } else {
                return res.status(404).json({message: `No review found for the book with ISBN ${isbn}.`})
            }
        } else {
            return res.status(404).json({message: `No reviews found for the book with ISBN ${isbn}.` });
        }
    } else {
        return res.status(404).json({message: "Book with the given ISBN not found!" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
