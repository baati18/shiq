# Expense Salary App

## Deployment

### Frontend
- This repository deploys the React app from `frontend/`.
- Use Vercel and set the project root to `frontend`.
- Framework preset: Create React App.
- Set `REACT_APP_API_URL` in `frontend/.env` or use `frontend/.env.example` for your deployed backend.

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
- The frontend currently reads the API base URL from `frontend/.env` via `REACT_APP_API_URL`.
- In production, update the frontend API base URL to your deployed backend URL.

### Local mobile testing
1. Find your PC LAN IP with `ipconfig` (Windows) or `ifconfig` / `ip addr` (Mac/Linux).
2. Start the backend normally: `cd backend && npm run dev`.
3. Start the frontend normally: `cd frontend && npm start`.
4. Create `frontend/.env` with this value:
   - `REACT_APP_API_URL=http://<your-pc-ip>:5000`
5. Visit on your phone:
   - `http://<your-pc-ip>:3000`
6. Confirm your phone and PC are on the same Wi-Fi network.

> Tip: If your frontend server must also be reachable from the phone, start CRA with `HOST=0.0.0.0` before `npm start`.
