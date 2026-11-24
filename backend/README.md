# MSA Developer Portfolio Backend

Express 5 + MongoDB/Mongoose API for the MSA Developer Portfolio.

## 1. Install

```bash
cd backend
npm install
```

## 2. Environment

Copy `.env.example` to `.env` and fill in your MongoDB Atlas URI, a long random JWT secret, and admin credentials. Never commit `.env` or share it publicly.

In MongoDB Atlas, create a Database User and allow your development IP in Network Access. If your password contains special characters, URL-encode them in the MongoDB URI.

## 3. Create the first admin

```bash
npm run seed:admin
```

This creates or updates the one admin account using `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` from `.env`. There is intentionally no public admin-registration endpoint.

## 4. Run the API

```bash
npm run dev
```

Open `http://localhost:5000/` or `http://localhost:5000/api/health`.

## API endpoints

- `POST /api/auth/login` — public admin login
- `GET /api/projects` — public list of projects
- `GET /api/projects/:id` — public project details
- `POST /api/projects` — admin only, create project
- `PUT /api/projects/:id` — admin only, update project
- `DELETE /api/projects/:id` — admin only, delete project
- `POST /api/contacts` — public contact form submission
- `GET /api/contacts` — admin only, list messages
- `PATCH /api/contacts/:id/read` — admin only, mark message as read
- `DELETE /api/contacts/:id` — admin only, delete message

For protected endpoints, send this HTTP header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## Example project JSON

```json
{
  "title": "My Portfolio",
  "category": "Frontend Development",
  "description": "A responsive portfolio website.",
  "technologies": ["React", "Tailwind CSS", "JavaScript"],
  "liveUrl": "https://example.com",
  "githubUrl": "https://github.com/username/repository",
  "imageUrl": "https://example.com/project-image.jpg",
  "featured": true,
  "order": 1
}
```

## Example contact JSON

```json
{
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "subject": "Project inquiry",
  "message": "Hello, I would like to discuss a project."
}
```

This backend provides the API. The React frontend must be connected to these endpoints separately in the next integration step.
