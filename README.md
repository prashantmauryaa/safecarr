# CarSafe - Emergency QR System

A mobile-first web application designed for emergency situations. No login required for helpers.

## 🚀 Quick Start

Since you are already in the project folder, you can use the newly added root scripts:

1.  **Install Dependencies** (First time only):
    ```bash
    npm run install-all
    ```

2.  **Start the App**:
    ```bash
    npm run dev
    ```
    This will start both the Backend (Port 3000) and Frontend (Port 5173/5174).

## 📂 Project Structure

-   `server/` - Node.js + Express + SQLite Backend
    -   `src/db/` - Database setup
    -   `src/routes/` - API endpoints
-   `client/` - React + Vite Frontend
    -   `src/pages/` - UI Pages (Home, Dashboard, QR View)

## 🔑 Features

-   **Mobile-First Design**: Optimized for phone screens.
-   **Anonymous Scanning**: Helpers scan QR to see info without login.
-   **Incident Mode**: One-tap emergency guidance.
-   **Secure**: Only owners can edit data.

## 🛠 Tech Stack

-   **Frontend**: React, Vite, Lucide Icons, QR Code React.
-   **Backend**: Node.js, Express, Better-SQLite3, JSON Web Tokens.
