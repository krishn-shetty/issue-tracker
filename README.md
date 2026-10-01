# Issue Tracker

Full-stack issue tracker (React + Express + MongoDB). **This drop contains the backend (`server/`); the React client (`client/`) is added next.**

## Features (backend)
Register / login / logout (HTTP-only JWT cookie) · issues CRUD with search, status/priority/assignee filters and pagination · change status · assign users · comments CRUD with ownership rules · dashboard summary · seed script · smoke test.

## Stack
Node 18.18+, Express 4, MongoDB + Mongoose, JWT, bcryptjs, Zod, Helmet, CORS, cookie-parser, Morgan, express-rate-limit.

## Architecture
`Route → Controller → Service → Repository → Mongoose → MongoDB`. Controllers are thin, rules live in services, queries live in repositories, Zod validates every request in the `validate` middleware.

## Local setup
```bash
git clone <repo> && cd issue-tracker
npm run install:all          # installs server deps
cp .env.example server/.env  # then fill MONGODB_URI and JWT_SECRET
npm run seed                 # demo data
npm run dev                  # http://localhost:5000/api/v1/health
npm run smoke                # (server running) end-to-end API checks
```
Generate a secret: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## Environment variables (`server/.env`)
| Var | Notes |
|---|---|
| NODE_ENV | development / production |
| PORT | default 5000 |
| MONGODB_URI | Atlas `mongodb+srv://...` or `mongodb://127.0.0.1:27017/issue-tracker` |
| JWT_SECRET | >= 16 chars, random |
| CLIENT_URL | allowed frontend origin(s), comma-separated (CORS + CSRF origin check) |

## Demo credentials (seed)
- Admin: `admin@example.com` / `Admin@123`
- Users: `rahul@example.com`, `anil@example.com`, `john@example.com` / `User@123`

## API
Responses: `{ success, data, pagination? }` or `{ success:false, message, errors? }`. Everything except register/login/logout/health needs the auth cookie.

| Method | Path | Notes |
|---|---|---|
| POST | /auth/register, /auth/login, /auth/logout | |
| GET | /auth/me | |
| GET | /users, /users/:id | `search,page,limit` |
| GET | /issues | `search,status,priority,assignee(me\|unassigned\|id),page,limit` |
| POST | /issues | |
| GET/PATCH/DELETE | /issues/:id | edit/delete: creator or admin |
| PATCH | /issues/:id/status | creator, assignee or admin |
| PATCH | /issues/:id/assignee | creator or admin; `null` unassigns |
| GET/POST | /issues/:issueId/comments | |
| PATCH | /comments/:id | author only |
| DELETE | /comments/:id | author or admin |
| GET | /dashboard/summary | counts, breakdown, 5 recent issues |

## Security
bcryptjs (cost 12); password `select:false` and stripped in `toJSON`; JWT in HTTP-only cookie (`Secure` + `SameSite=None` in production, `Lax` in dev); Helmet; explicit CORS allow-list with credentials; Origin check on state-changing requests (CSRF); Zod validation on params/query/body (unknown keys stripped, no Mongo operators reach queries); escaped regex search; pagination caps; auth rate limiting; generic 500s with no stack traces in production; secrets only in env; roles never accepted from the client.

## Deployment
Database: MongoDB Atlas (allow your host's IPs). Backend: Render/Railway, root dir `server`, build `npm install`, start `npm start`, env vars set with `NODE_ENV=production` and `CLIENT_URL=<your Vercel URL>`. Frontend: Vercel with `VITE_API_URL=<backend>/api/v1`.

## Limitations
No refresh tokens, email verification, password reset or user-management endpoints. Comment edit is author-only.
