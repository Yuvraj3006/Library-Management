# Library Management System

## Overview
The Library Management System (LMS) is a web-based application designed to help manage a library's books, readers, and borrowing system. The system provides a platform for authors to add books, while readers can borrow and return books. The system also offers "Remember Me" functionality for user authentication, along with role-based access control (e.g., Authors, Readers).

This project is built using **Node.js**, **Express.js**, **MySQL**, and **JWT** for user authentication.

## Features

### For Authors:
- Add, update, or delete books.
- View all books in the library.
- Manage the stock of books.

### For Readers:
- Borrow books from the library (with restrictions on the number of books).
- View the list of borrowed books.
- Return books after reading them.

### Admin (optional role):
- Manage users and assign roles.
- Manage the overall library system.

### Authentication:
- JWT-based authentication for secure login and access.
- Role-based authorization for different user types (Author, Reader).

### "Remember Me" functionality for session management.

## Tech Stack

- **Frontend**: Not implemented (This is a backend system).
- **Backend**: 
  - **Node.js** - Server-side JavaScript runtime.
  - **Express.js** - Web framework for Node.js.
  - **JWT** - JSON Web Tokens for user authentication.
- **Database**: 
  - **MySQL** - Relational database management system.
- **Middleware**: 
  - Authentication middleware for validating JWT tokens and securing routes.

## Installation

### Prerequisites
Before you begin, ensure that you have the following installed:
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)

### Steps to Install:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Yuvraj3006/LibraryManagement.git
   Navigate to the project folder:

bash
2 Navigate to Project Folder
cd LibraryManagement

3. Install dependencies:
npm install

4. Set up the database:

Create a MySQL database and configure it in the database/database.js file.
use the MySQL dump file provided in the database folder.
use the commands :
Login to your MySQL : 
mysql -u [username] -p

Create a database with librarymanagement name :
CREATE DATABASE librarymanagement;
Exit the MySQL Shell : 
exit;

Now restore the dump file using the following command :
mysql -u root -p librarymanagement < library_management.sql

5  .Set up environment variables:

Create a .env file in the root of the project.

Add the following environment variables:

env
Copy code
ACCESS_TOKEN_SECRET=your_secret_key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_management
Start the server:


npm start
The server should be running on http://localhost:8000


Link to the API Documentation : https://documenter.getpostman.com/view/33342571/2sAYHzFhod
