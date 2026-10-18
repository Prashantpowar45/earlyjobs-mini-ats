# TalentFlow — Mini Applicant Tracking System

Full-stack recruiting dashboard for the EarlyJobs.ai Full Stack Developer Intern assignment.

## Tech Stack
React 18, Vite, Node.js, Express, MongoDB, Mongoose, Recharts, Lucide and Zod.

## Features
- Create, view, update and delete candidates
- Search by name, email, role and skills
- Hiring stages: Applied, Screening, Interview, Offer, Hired and Rejected
- Stage changes, sorting, filtering and pagination
- Dashboard KPIs and pipeline charts
- Responsive interface, validation and duplicate-email handling
- Fictional seed data for demonstration

## Local Setup
Requires Node.js 20+ and local MongoDB or MongoDB Atlas.

```bash
npm install
npm install --prefix server
npm install --prefix client
cp server/.env.example server/.env
# Edit server/.env for your MongoDB URI
npm run seed
npm run dev
```

Windows PowerShell: `Copy-Item server/.env.example server/.env`

Open http://localhost:5173 and check the API at http://localhost:5000/api/health.

## Tests
```bash
npm test --prefix server
npm run build
```

## API
| Method | Path | Purpose |
| --- | --- | --- |
| GET | /api/health | Health check |
| GET | /api/candidates | Search, filter, paginate, sort |
| POST | /api/candidates | Add candidate |
| PUT | /api/candidates/:id | Edit candidate |
| PATCH | /api/candidates/:id/stage | Update hiring stage |
| DELETE | /api/candidates/:id | Delete candidate |
| GET | /api/metrics | Dashboard counts |

Example input:
```json
{"name":"Sam Patel","email":"sam@example.com","role":"Frontend Developer","skills":["React","JavaScript"],"experience":2,"source":"LinkedIn","stage":"Applied","notes":""}
```

## Deployment
1. Create a MongoDB Atlas database and user. Keep credentials private.
2. Deploy the `server` folder as a Render web service. Build: `npm install`; start: `npm start`. Set `MONGODB_URI` and `CLIENT_ORIGIN` (your Vercel URL).
3. Deploy the `client` folder to Vercel with the Vite preset. Set `VITE_API_URL` to your Render API URL (without a trailing slash).
4. Verify the live app by creating, editing, filtering and deleting fictional candidates.

## Demo Video (90 seconds)
0:00–0:12 dashboard charts and KPIs; 0:12–0:35 add candidate; 0:35–0:50 search and filter; 0:50–1:05 update stage and refresh dashboard; 1:05–1:18 edit/delete; 1:18–1:30 architecture and URLs.

## Submission Checklist
- [ ] Verified GitHub repository with frontend and API
- [ ] Tested live deployed URL
- [ ] Public demo video link
- [ ] Screening form submitted

## Verification / Caveats
Server syntax checks passed on October 18, 2026. Dependency installation timed out in the available environment, so full unit tests, React production build and live database tests have not been verified. This is a demo application without login or authorization; only use fictional candidate data until authentication and permissions are added.
