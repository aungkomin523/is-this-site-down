const dns = require("node:dns").promises;
const net = require("node:net");

function isPrivateIp(ip) {
  // IPv4
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);

    const [a, b] = parts;

    // 10.0.0.0/8
    if (a === 10) return true;

    // 172.16.0.0/12
    if (a === 172 && b >= 16 && b <= 31) return true;

    // 192.168.0.0/16
    if (a === 192 && b === 168) return true;

    // 127.0.0.0/8
    if (a === 127) return true;

    // 169.254.0.0/16 - link local / AWS metadata
    if (a === 169 && b === 254) return true;

    // 0.0.0.0/8
    if (a === 0) return true;

    return false;
  }

  // IPv6
  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();

    // ::1 - localhost
    if (normalized === "::1") return true;

    // fc00::/7 - private
    if (
      normalized.startsWith("fc") ||
      normalized.startsWith("fd")
    ) {
      return true;
    }

    // fe80::/10 - link local
    if (normalized.startsWith("fe8") ||
        normalized.startsWith("fe9") ||
        normalized.startsWith("fea") ||
        normalized.startsWith("feb")) {
      return true;
    }

    return false;
  }

  return true;
}

async function validateUrl(urlString) {
  let url;

  try {
    url = new URL(urlString);
  } catch {
    throw new Error("Invalid URL");
  }

  // Only allow HTTP/HTTPS
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only HTTP and HTTPS URLs are allowed");
  }

  // Don't allow credentials in URL
  if (url.username || url.password) {
    throw new Error("URLs with credentials are not allowed");
  }

  const hostname = url.hostname;

  // If hostname itself is an IP address
  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      throw new Error("Private IP addresses are not allowed");
    }

    return url;
  }

  // Resolve hostname
  const addresses = await dns.lookup(hostname, {
    all: true,
    verbatim: true,
  });

  if (!addresses.length) {
    throw new Error("Could not resolve hostname");
  }

  // Every resolved IP must be public
  for (const address of addresses) {
    if (isPrivateIp(address.address)) {
      throw new Error("Hostname resolves to a private IP address");
    }
  }

  return url;
}

module.exports = {
  validateUrl,
};