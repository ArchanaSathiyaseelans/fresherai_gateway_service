import express from "express";
import dotenv from "dotenv";
dotenv.config();
import proxy from "express-http-proxy";
import dns from "dns";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { isAuth } from "./middlewares/isAuth.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import { proxyWithUser } from "./utils/proxyWithHeaders.js";
dns.setServers(["0.0.0.0", "8.8.8.8"]);
const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(morgan("dev"));
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.send(`hello from Server`);
});
app.use(
  "/api/auth",
  proxy(process.env.AUTH_SERVICE_URL || "http://3.218.20.238:8001"),
);

app.get("/api/me", isAuth, getCurrentUser);

app.use(
  "/api/interview",
  isAuth,
  proxyWithUser(
    process.env.INTERVIEW_SERVICE_URL || "http://3.218.20.238:8002",
  ),
);

app.use(
  "/api/resume",
  isAuth,
  proxyWithUser(process.env.RESUME_SERVICE_URL || "http://3.218.20.238:8003"),
);

app.use(
  "/api/roadmap",
  isAuth,
  proxyWithUser(process.env.ROADMAP_SERVICE_URL || "http://3.218.20.238:8004"),
);

app.use(
  "/api/billing",
  isAuth,
  proxyWithUser(process.env.BILLING_SERVICE_URL || "http://3.218.20.238:8005"),
);

app.listen(PORT, () => {
  console.log(`Gateway Started on ${PORT}`);
});
