import { randomUUID } from "node:crypto"

const DASHBOARD_CAFE = "Starbucks · South End, Charlotte, NC"

const FOOD_LBS_PER_UNIT = {
  Bakery: 0.4,
  "Hot Food": 0.75,
  Drinks: 0.55,
  Salads: 0.7,
}

const DEFAULT_FOOD_LBS_PER_UNIT = 0.6
const METHANE_CO2E_LBS_PER_FOOD_LB = 3.1

const CAT_ICONS = {
  Bakery: "🥐",
  "Hot Food": "🫕",
  Drinks: "☕",
  Salads: "🥗",
}

let listings = [
  { id: 1, name: "Blueberry Muffin", cat: "Bakery", orig: 4.95, sale: 1.95, qty: 3, max: 5, mins: 85, cafe: "Starbucks · South End, Charlotte, NC", icon: "🧁" },
  { id: 2, name: "Butter Croissant", cat: "Bakery", orig: 4.45, sale: 1.75, qty: 4, max: 7, mins: 60, cafe: "Starbucks · South End, Charlotte, NC", icon: "🥐" },
  { id: 3, name: "Iced Caramel Macchiato", cat: "Drinks", orig: 6.25, sale: 2.75, qty: 6, max: 9, mins: 100, cafe: "Starbucks · South End, Charlotte, NC", icon: "🥤" },
  { id: 4, name: "Pepperoni Slice", cat: "Hot Food", orig: 5.25, sale: 2.2, qty: 5, max: 8, mins: 40, cafe: "Domino's · Uptown, Charlotte, NC", icon: "🍕" },
  { id: 5, name: "Garlic Parmesan Knots", cat: "Hot Food", orig: 6, sale: 2.5, qty: 3, max: 6, mins: 55, cafe: "Domino's · University City, Charlotte, NC", icon: "🧄" },
  { id: 6, name: "Chicken Sandwich", cat: "Hot Food", orig: 6.85, sale: 2.95, qty: 4, max: 7, mins: 45, cafe: "Chick-fil-A · SouthPark, Charlotte, NC", icon: "🍔" },
  { id: 7, name: "Waffle Fries", cat: "Hot Food", orig: 4.35, sale: 1.85, qty: 7, max: 10, mins: 70, cafe: "Chick-fil-A · SouthPark, Charlotte, NC", icon: "🍟" },
  { id: 8, name: "Cobb Salad", cat: "Salads", orig: 9.45, sale: 4.25, qty: 2, max: 4, mins: 50, cafe: "Chick-fil-A · University City, Charlotte, NC", icon: "🥗" },
  { id: 9, name: "Spinach, Feta & Egg Wrap", cat: "Hot Food", orig: 5.95, sale: 2.4, qty: 3, max: 5, mins: 65, cafe: "Starbucks · South End, Charlotte, NC", icon: "🌯" },
]

let nextId = 10

let impact = {
  foodLbs: 0,
  methaneLbs: 0,
  itemsRescued: 0,
  orders: 0,
}

let users = []
let nextUserId = 1
const sessions = new Map()

const copy = (value) => JSON.parse(JSON.stringify(value))

const calcFoodDivertedLbs = (items) =>
  items.reduce((sum, item) => {
    const perUnit = FOOD_LBS_PER_UNIT[item.cat] || DEFAULT_FOOD_LBS_PER_UNIT
    return sum + perUnit * item.qty
  }, 0)

const calcMethaneAvoidedLbs = (foodLbs) => foodLbs * METHANE_CO2E_LBS_PER_FOOD_LB

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  cafeName: user.cafeName || "",
})

const getUserById = (id) => users.find((user) => user.id === id)

const createSessionForUser = (userId) => {
  const token = randomUUID()
  sessions.set(token, userId)
  return token
}

const normalizeEmail = (email) => String(email || "").trim().toLowerCase()

export function signupUser(payload) {
  const name = String(payload.name || "").trim()
  const email = normalizeEmail(payload.email)
  const password = String(payload.password || "")
  const role = payload.role === "cafe" ? "cafe" : "customer"
  const cafeName = String(payload.cafeName || "").trim()

  if (!name || !email || password.length < 6) {
    throw new Error("Please provide name, email, and a 6+ character password")
  }

  if (role === "cafe" && !cafeName) {
    throw new Error("Cafe accounts require a cafe name")
  }

  if (users.some((user) => user.email === email)) {
    throw new Error("An account with this email already exists")
  }

  const user = {
    id: nextUserId,
    name,
    email,
    password,
    role,
    cafeName: role === "cafe" ? cafeName : "",
  }

  nextUserId += 1
  users = [...users, user]

  const token = createSessionForUser(user.id)
  return {
    token,
    user: sanitizeUser(user),
  }
}

export function loginUser(payload) {
  const email = normalizeEmail(payload.email)
  const password = String(payload.password || "")

  const user = users.find((entry) => entry.email === email && entry.password === password)
  if (!user) {
    throw new Error("Invalid email or password")
  }

  const token = createSessionForUser(user.id)
  return {
    token,
    user: sanitizeUser(user),
  }
}

export function getUserFromToken(token) {
  if (!token) {
    return null
  }

  const userId = sessions.get(token)
  if (!userId) {
    return null
  }

  const user = getUserById(userId)
  return user ? sanitizeUser(user) : null
}

export function logoutToken(token) {
  if (!token) {
    return false
  }

  return sessions.delete(token)
}

export function getListings(category) {
  if (!category || category === "All") {
    return copy(listings)
  }
  return copy(listings.filter((listing) => listing.cat === category))
}

export function getImpact() {
  return copy(impact)
}

export function getDashboardCafe() {
  return DASHBOARD_CAFE
}

export function createListing(payload) {
  const qty = Number.parseInt(payload.qty, 10)
  const orig = Number.parseFloat(payload.orig)
  const sale = Number.parseFloat(payload.sale)

  if (!payload.name || Number.isNaN(qty) || Number.isNaN(orig) || Number.isNaN(sale)) {
    throw new Error("Missing required fields")
  }

  if (qty <= 0 || sale <= 0 || orig <= 0 || sale >= orig) {
    throw new Error("Invalid listing values")
  }

  const listing = {
    id: nextId,
    name: payload.name,
    cat: payload.cat || "Bakery",
    orig,
    sale,
    qty,
    max: qty,
    mins: Number.parseInt(payload.mins, 10) || 120,
    cafe: payload.cafe || DASHBOARD_CAFE,
    icon: payload.icon || CAT_ICONS[payload.cat] || "🍽",
  }

  nextId += 1
  listings = [...listings, listing]

  return copy(listing)
}

export function deleteListing(id) {
  const existing = listings.find((listing) => listing.id === id)
  if (!existing) {
    return false
  }

  listings = listings.filter((listing) => listing.id !== id)
  return true
}

export function checkout(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error("Checkout requires at least one item")
  }

  const requested = rawItems.map((item) => ({
    id: Number.parseInt(item.id, 10),
    qty: Number.parseInt(item.qty, 10),
  }))

  for (const item of requested) {
    if (Number.isNaN(item.id) || Number.isNaN(item.qty) || item.qty <= 0) {
      throw new Error("Invalid checkout item payload")
    }

    const listing = listings.find((entry) => entry.id === item.id)
    if (!listing) {
      throw new Error(`Item ${item.id} no longer exists`)
    }

    if (listing.qty < item.qty) {
      throw new Error(`${listing.name} does not have enough inventory`)
    }
  }

  const purchased = requested.map((item) => {
    const listing = listings.find((entry) => entry.id === item.id)
    return {
      id: listing.id,
      name: listing.name,
      cat: listing.cat,
      qty: item.qty,
      sale: listing.sale,
      orig: listing.orig,
    }
  })

  listings = listings.map((listing) => {
    const entry = requested.find((item) => item.id === listing.id)
    if (!entry) {
      return listing
    }
    return {
      ...listing,
      qty: listing.qty - entry.qty,
    }
  })

  const rescuedItems = purchased.reduce((sum, item) => sum + item.qty, 0)
  const rescuedFoodLbs = calcFoodDivertedLbs(purchased)
  const methaneAvoidedLbs = calcMethaneAvoidedLbs(rescuedFoodLbs)

  impact = {
    foodLbs: impact.foodLbs + rescuedFoodLbs,
    methaneLbs: impact.methaneLbs + methaneAvoidedLbs,
    itemsRescued: impact.itemsRescued + rescuedItems,
    orders: impact.orders + 1,
  }

  return {
    rescuedFoodLbs,
    methaneAvoidedLbs,
    rescuedItems,
    impact: copy(impact),
  }
}
