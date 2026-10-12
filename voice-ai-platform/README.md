# Voice AI Platform

React and TypeScript frontend with an Express backend and OpenRouter chat.
Browser speech recognition turns microphone input into text; browser speech
synthesis reads AI replies aloud. Chrome or Edge is recommended for voice input.

## Setup

Use Node.js 22 or newer and npm.

1. In `backend`, run `npm install`.
2. Copy `backend/.env.example` to `backend/.env`.
3. Set `OPENROUTER_API_KEY` to your own key. Set `OPENROUTER_MODEL` to a
   model available to your account, or keep `openrouter/auto`.
4. In `frontend`, run `npm install`.

Keep the API key in the backend environment file.
Without a key, the app starts and chat displays a configuration error.

## Run

In one terminal:

```powershell
cd backend
npm run dev
```

In a second terminal:

```powershell
cd frontend
npm run dev
```

Open http://localhost:5173. The backend runs at http://localhost:3000.
Vite forwards requests under `/api` to the backend.
Allow microphone access when you select **Start listening**.
Check the transcript, then select **Send message**.

## Build and check

Run `npm run build` in each directory. The frontend build includes TypeScript
checking. To run the compiled backend, use `npm start` after building it.

- `GET /api/health`: local health and AI configuration status.
- `GET /api/health/openrouter`: makes a real AI request (may incur provider charges).
- `POST /api/ai/chat`: JSON `{ "message": "Hello", "conversationHistory": [] }`.

OpenRouter integration follows its
[chat completions documentation](https://openrouter.ai/docs/api/api-reference/chat/send-chat-completion-request).

Microphone permission, speech recognition and spoken output require manual
browser verification. This local app has no user authentication.
