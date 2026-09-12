require("dotenv").config();

const express = require("express");
const { checkWebsite } = require("./checker");
const { validateUrl } = require("./url-validator");

const app = express();

app.use(express.json());

app.use(express.json({ limit: "10kb" }));

app.disable("x-powered-by");

const PORT = process.env.PORT || 3001;
const REGION = process.env.REGION || "unknown";

const rateLimit = require("express-rate-limit");

const checkLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const WORKER_SECRET = process.env.WORKER_SECRET;

if (!WORKER_SECRET) {
  throw new Error("WORKER_SECRET is not configured");
}

function authenticateWorker(req, res, next) {
  const providedSecret = req.get("X-Worker-Key");

  if (!providedSecret || providedSecret !== WORKER_SECRET) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  next();
}

app.post("/check", authenticateWorker, checkLimiter, async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      error: "URL is required",
    });
  }

  try {
    const validatedUrl = await validateUrl(url);

    const result = await checkWebsite(validatedUrl.toString());

    return res.json({
      region: REGION,
      url: validatedUrl.toString(),
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    region: REGION,
  });
});

app.listen(PORT, () => {
  console.log(`Worker running on port ${PORT}`);
  console.log(`Region: ${REGION}`);
});