import cors from "cors"
import express from "express"
import {
  checkout,
  createListing,
  deleteListing,
  getDashboardCafe,
  getImpact,
  getListings,
} from "./data/store.js"

const app = express()
const PORT = Number.parseInt(process.env.PORT, 10) || 4000

app.use(cors())
app.use(express.json())

app.get("/api/health", (_, res) => {
  res.status(200).json({ status: "ok" })
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
