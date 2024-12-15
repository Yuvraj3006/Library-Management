# Library Management System (LMS)

## Overview
The **Library Management System (LMS)** is a web-based application designed to facilitate the management of books, users, and borrowing processes within a library. The system enables **Authors** to add and manage books, while **Readers** can borrow and return books. The application also includes **role-based access control**, allowing for differentiated access for **Authors**, **Readers**, and **Admins**. Additionally, it features **JWT**-based authentication and a **"Remember Me"** functionality for managing user sessions.

This project is built using **Node.js**, **Express.js**, **MySQL**, and **JWT** for user authentication.

## Features

### For Authors:
- Add, update, or delete books.
- View a list of all books in the library.
- Manage book stock levels.

### For Readers:
- Borrow books from the library, subject to borrowing limits.
- View a list of borrowed books.
- Return books after reading them.

### Admin (optional role):
- Manage users and assign roles.
- Manage the overall library system, including book and user information.

### Authentication:
- **JWT-based authentication** for secure login and access control.
- **Role-based authorization** for different user types (Author, Reader).

### "Remember Me" functionality:
- Allows users to stay logged in for an extended period without having to reauthenticate.

## Tech Stack

- **Frontend**: Not implemented (Backend system only).
- **Backend**:
  - **Node.js** - Server-side JavaScript runtime.
  - **Express.js** - Web framework for Node.js.
  - **JWT** - JSON Web Tokens for secure user authentication.
- **Database**:
  - **MySQL** - Relational database for storing user and book data.
- **Middleware**:
  - Authentication middleware for validating JWT tokens and securing routes.

## Installation

### Prerequisites
Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Server-side JavaScript runtime).
- [MySQL](https://www.mysql.com/) (Relational database management system).

### Steps to Install:

1. **Clone the repository** to your local machine:

   ```bash
   git clone https://github.com/Yuvraj3006/LibraryManagement.git
   ```

2. **Navigate to the project folder**:

   ```bash
   cd LibraryManagement
   ```

3. **Install dependencies**:

   Run the following command to install all necessary dependencies:

   ```bash
   npm install
   ```

4. **Set up the database**:

   - Create a MySQL database and configure it in the `database/database.js` file.
   - Use the MySQL dump file provided in the `database` folder.
   
   **Database Setup Steps**:
   - Login to MySQL:

     ```bash
     mysql -u [username] -p
     ```

   - Create the database:

     ```sql
     CREATE DATABASE librarymanagement;
     ```

   - Exit the MySQL Shell:

     ```sql
     exit;
     ```

   - Restore the dump file:

     ```bash
     mysql -u root -p librarymanagement < database/library_management.sql
     ```

5. **Set up environment variables**:

   - Create a `.env` file in the root of the project.
   - Add the following environment variables to the `.env` file:

     ```env
     ACCESS_TOKEN_SECRET=your_secret_key
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=library_management
     ```

6. **Start the server**:

   Run the following command to start the server:

   ```bash
   npm start
   ```

   The server should now be running on `http://localhost:8000`.

## API Documentation

For detailed API endpoints and usage, refer to the [API Documentation](https://documenter.getpostman.com/view/33342571/2sAYHzFhod).

## License
This project is open-source and available under the [MIT License](LICENSE).

---

This structure ensures clarity and ease of use, making it straightforward for users to set up the project and understand the main functionalities.
