const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")

async function request(path, init = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Request failed")
  }

  return data
}

export const api = {
  getListings(category = "All") {
    const query = category && category !== "All" ? `?category=${encodeURIComponent(category)}` : ""
    return request(`/api/listings${query}`)
  },
  createListing(payload) {
    return request("/api/listings", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
  deleteListing(id) {
    return request(`/api/listings/${id}`, {
      method: "DELETE",
    })
  },
  getImpact() {
    return request("/api/impact")
  },
  checkout(items) {
    return request("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ items }),
    })
  },
}
