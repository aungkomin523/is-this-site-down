// Accept "example.com" as well as "https://example.com"
export const normalizeUrl = (value) => {
  const trimmed = value.trim()
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}
