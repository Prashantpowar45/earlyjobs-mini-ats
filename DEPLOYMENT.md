# EarlyJobs ATS Deployment and Verification

## Current architecture
- Backend: Render (root directory `server`; `render.yaml` at repository root)
- Frontend: Vercel (root directory `client`)
- MongoDB: Atlas database `earlyjobs_ats`, collection `candidates`

## 1. Backend (Render)
Create a Render Web Service from this repository (or use the repository's Render Blueprint).
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment variables:
  - `MONGODB_URI`: private MongoDB Atlas connection string, with database path `/earlyjobs_ats`
  - `CLIENT_ORIGIN`: deployed Vercel frontend origin, e.g. `https://YOUR-SITE.vercel.app`
  - `NODE_ENV`: `production`

Never commit any database user password, private key, connection string with credentials, or .env file. Configure these in Render's environment settings only.

MongoDB Atlas Network Access must permit the backend's egress address. Prefer a narrow allowlist if a stable egress IP is available.

Test: `https://YOUR-API.onrender.com/api/health` should return `{"status":"ok"}`.
Note: the health endpoint intentionally works without MongoDB; it **does not** prove the database is connected.

## 2. Frontend (Vercel)
Import the same GitHub repository as a new Vercel project.
- Root Directory: `client`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment variable `VITE_API_URL`: backend origin, e.g. `https://YOUR-API.onrender.com` (no `/api` suffix)
Redeploy after changing environment variables. Set Render `CLIENT_ORIGIN` to match the final frontend domain.

This separated-deployment setup is independent of the experimental root `vercel.json` multi-service config.

## 3. Smoke-test checklist
- [ ] GET /api/health is HTTP 200
- [ ] GET /api/metrics returns initial counts (tests MongoDB availability)
- [ ] Add fictional candidate; candidate appears in list
- [ ] Search candidate by name; search by role
- [ ] Filter stage; change stage; metrics refresh
- [ ] Edit candidate and confirm changes remain visible
- [ ] Duplicate email is rejected with HTTP 409
- [ ] Delete candidate; candidate disappears
- [ ] Reload frontend; verify persistence
- [ ] Confirm mobile layout and browser console without errors
- [ ] Record demo and make its URL viewable by the reviewer

## 4. Submission
Share the GitHub repository URL, verified Vercel app URL, and public demo video URL in the assignment form.

## Security
This project is an **unauthenticated assignment demo**: anyone who discovers its API could modify/delete data. Use fictional records only, do not store real applicants, and do not treat it as production-ready until authentication/authorization are added.
