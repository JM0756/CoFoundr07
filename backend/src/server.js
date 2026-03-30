import cors from "cors"
import express from "express"
import {
  checkout,
  createListing,
  deleteListing,
  getDashboardCafe,
  getImpact,
  getListings,
  getUserFromToken,
  loginUser,
  logoutToken,
  signupUser,
} from "./data/store.js"

const app = express()
const PORT = Number.parseInt(process.env.PORT, 10) || 4000

app.use(cors())
app.use(express.json())

const getBearerToken = (req) => {
  const header = req.headers.authorization || ""
  if (!header.startsWith("Bearer ")) {
    return ""
  }
  return header.slice(7).trim()
}

app.get("/api/health", (_, res) => {
  res.status(200).json({ status: "ok" })
})

app.post("/api/auth/signup", (req, res) => {
  try {
    const result = signupUser(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.post("/api/auth/login", (req, res) => {
  try {
    const result = loginUser(req.body)
    res.status(200).json(result)
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
})

app.get("/api/auth/me", (req, res) => {
  const token = getBearerToken(req)
  const user = getUserFromToken(token)
  if (!user) {
    res.status(401).json({ message: "Invalid or expired session" })
    return
  }
  res.status(200).json({ user })
})

app.post("/api/auth/logout", (req, res) => {
  const token = getBearerToken(req)
  logoutToken(token)
  res.status(204).send()
})

app.get("/api/listings", (req, res) => {
  const category = req.query.category
  res.status(200).json({
    listings: getListings(category),
    dashboardCafe: getDashboardCafe(),
  })
})

app.post("/api/listings", (req, res) => {
  try {
    const listing = createListing(req.body)
    res.status(201).json({ listing })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.delete("/api/listings/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10)
  const ok = deleteListing(id)

  if (!ok) {
    res.status(404).json({ message: "Listing not found" })
    return
  }

  res.status(204).send()
})

app.get("/api/impact", (_, res) => {
  res.status(200).json({ impact: getImpact() })
})

app.post("/api/checkout", (req, res) => {
  try {
    const result = checkout(req.body.items)
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.use((_, res) => {
  res.status(404).json({ message: "Not found" })
})

app.listen(PORT, () => {
  console.log(`LastBite backend listening on port ${PORT}`)
})
