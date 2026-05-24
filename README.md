# Expense Salary App

## Deployment

### Frontend
- This repository deploys the React app from `frontend/`.
- Use Vercel and set the project root to `frontend`.
- Framework preset: Create React App.

### Backend
- The backend is a separate Express API in `backend/`.
- It requires environment variables and MongoDB.
- Recommended hosting platforms:
  - Railway
  - Render
  - Heroku

### Backend deployment steps
1. Create a new project on Railway or Render.
2. Connect your GitHub repo `baati18/shiq`.
3. Set the root directory to `backend`.
4. Add environment variables from `backend/.env.example`:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `SMS_MODE` (use `stub` if you do not want real Twilio SMS)
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
5. Use the start command `node server.js`.

### Notes
- The backend uses `process.env.PORT` and `MONGO_URI`.
- The frontend currently proxies API requests to `http://localhost:5000` in development.
- In production, update the frontend API base URL to your deployed backend URL.
