require("dotenv").config();

const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const { checkWebsite } = require("./checker");

const app = express();

const PORT = process.env.PORT || 3001;
const REGION = process.env.REGION || "unknown";
const WORKER_SECRET = process.env.WORKER_SECRET;

if (!WORKER_SECRET) {
  throw new Error("WORKER_SECRET is not configured");
}

app.disable("x-powered-by");

app.use(helmet());

app.use(
  express.json({
    limit: "10kb",
  })
);

const checkLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

function authenticateWorker(req, res, next) {
  const providedSecret = req.get("X-Worker-Key");

  if (!providedSecret || providedSecret !== WORKER_SECRET) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  next();
}

app.post(
  "/check",
  checkLimiter,
  authenticateWorker,
  async (req, res) => {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "URL is required",
      });
    }

    try {
      const result = await checkWebsite(url);

      return res.json({
        region: REGION,
        url,
        ...result,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    region: REGION,
  });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Worker running on port ${PORT}`);
  console.log(`Region: ${REGION}`);
});