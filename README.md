# Password Manager App

The Password Manager App is a web application that allows users to securely store and manage their passwords for various platforms such as Facebook, YouTube, Gmail, Twitter, GitHub, and TikTok.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Usage](#usage)
- [Environment Variables](#environment-variables)

## Features

- Securely store and manage passwords for multiple platforms
- User authentication (register and login)
- Encryption of stored passwords
- Responsive design for mobile and desktop users

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Material UI
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Encryption:** `mongoose-encryption`, `bcryptjs`

## Project Structure

│
├── backend/
│ ├── src/
│ ├── .env
│ ├── package.json
│ └── ...
│
├── frontend/
│ ├── public/
│ ├── src/
│ ├── .env
│ ├── package.json
│ └── ...
│
├── .gitignore
├── README.md
└── ...


## Setup Instructions

### Backend

1. **Navigate to the backend directory:**

   ```
   cd backend
   ```
2. **Install dependencies:**

    ```
    npm install
    ```
3. **Set up environment variables:**

    Sample is provided in .env-sample.txt file

4. **Run the server:**

    ```
    nodemon app.js 
    ```

### Frontend

1. **Navigate to the frontend directory:**

    ```
   cd frontend
   ```

2. **Install dependencies:**

    ```
    npm install
    ```

3. **Run the development server:**

    ```
    npm run dev
    ```

### Usage

1. ***Register a new user:***
Navigate to /register and create a new account.

2. ***Login:***
Navigate to /login and log in with your credentials.

3. ***Manage Passwords:***
After logging in, you can add, update, and view passwords for different platforms.