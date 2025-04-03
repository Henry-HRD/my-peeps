# My Peeps

A React application for managing your personal contacts with Firebase authentication and Firestore database.

## Features

- User authentication (signup/login)
- Add, edit, and delete contacts
- Persistent data storage with Firebase Firestore
- User-specific data (each user has their own list of contacts)
- Modern UI with Chakra UI components

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account and project

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd my-peeps
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and enable:
   - Authentication (Email/Password)
   - Firestore Database

4. The Firebase configuration is already set up in the project.

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Create a new account or log in with existing credentials
2. Add new contacts using the "Add Person" button
3. Edit or delete contacts using the respective icons
4. Log out when you're done

## Technologies Used

- React
- TypeScript
- Firebase (Authentication & Firestore)
- Chakra UI
- React Router
