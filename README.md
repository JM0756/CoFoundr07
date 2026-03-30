# CoFoundr07

LastBite is now organized as a fullstack project:

- `backend`: Express API server for listings, checkout, and impact stats.
- `src`: React frontend app (UI, API client, and global styles).

## Project Structure

```text
CoFoundr07/
	backend/
		src/
			data/
				store.js
			server.js
	src/
		api/
			client.js
		styles/
			global.css
		App.jsx
		main.jsx
	index.html
	package.json
```

## Scripts

- `npm run dev`: run frontend + backend together
- `npm run dev:client`: run Vite frontend only
- `npm run dev:server`: run Express backend only
- `npm run build`: build frontend
- `npm run preview`: preview frontend build

## API Endpoints

- `GET /api/health`
- `GET /api/listings`
- `POST /api/listings`
- `DELETE /api/listings/:id`
- `GET /api/impact`
- `POST /api/checkout`

## Run Manually

1. Open a terminal and go to this project folder:

	`cd CoFoundr07`

2. Install dependencies:

	`npm install`

3. Start frontend + backend together:

	`npm run dev`

4. Open the app:

	`http://localhost:5173/`

## Run Frontend and Backend Separately

Terminal A (backend):

`cd CoFoundr07`

`npm run dev:server`

Terminal B (frontend):

`cd CoFoundr07`

`npm run dev:client`

Then open:

`http://localhost:5173/`

## Stop the Server

- If running `npm run dev`, press `Ctrl + C` in that terminal.
- If running split terminals, press `Ctrl + C` in both terminal windows.

## Deploy (Frontend on GitHub Pages)

GitHub Pages can host only the frontend static site. The Express backend must be deployed separately.

1. Deploy backend (Render, Railway, Fly.io, or similar).
2. Copy backend URL (example: `https://your-backend.onrender.com`).
3. In GitHub repo settings, add secret:
	- `VITE_API_BASE_URL` = your backend URL
4. Push to `main`.
5. GitHub Action deploys `dist` to Pages automatically.

When published, your site URL will look like:

`https://<your-username>.github.io/CoFoundr07/`

## Deploy Backend (Recommended)

Use any Node.js host and set start command to:

`npm run dev:server`

For production, you can also run:

`node backend/src/server.js`

Default backend port is `4000` (or `PORT` environment variable if provided).
