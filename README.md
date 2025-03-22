# Voice Agent

This project provides a conversational AI application with a React frontend and an Express backend.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/markjtang/voice-agent.git
   cd voice-agent
   ```

2. Install dependencies for both the frontend and backend:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - You can copy `.env.example`
   - Add the following variables:
     ```env
     VITE_AGENT_ID=<your-agent-id>
     VITE_ELEVEN_LABS_API_KEY=<your-eleven-labs-api-key>
     ```

## Running the Backend

1. Start the backend server:
   ```bash
   node server.js
   ```
   The backend will run on `http://localhost:3001`.

## Running the Frontend

1. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## Accessing the Application

- Open your browser and navigate to `http://localhost:5173` to access the application.

## Notes

- Ensure the backend is running before starting the frontend to avoid API errors.
- Replace `<your-agent-id>` and `<your-eleven-labs-api-key>` with your actual ElevenLabs credentials.
