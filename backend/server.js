import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import * as dotenv from "dotenv";
import { checkJwt } from "./middlewares/auth.js";
import mongoose from "mongoose";
import * as OpenApiValidator from "express-openapi-validator";
import { BusinessError } from "./errors/BusinessError.js";
import http from "http";
import { Server } from "socket.io";
import { HttpError } from "express-openapi-validator/dist/framework/types.js";
import { UnauthorizedError } from "express-oauth2-jwt-bearer";
import { wrap } from "./socketMiddlewares/wrap.js";
import { validatePayloadByEvent } from "./socketMiddlewares/socketValidator.js";
import userModel from "./models/userModel.js";
import messagingHandler from "./socketEventHandlers/messagingHandler.js";
import groupHandler from "./socketEventHandlers/groupHandler.js";
import videoCallHandler from "./socketEventHandlers/videoCallHandler.js";
import { leaveCall } from "./socketEventHandlers/videoCallHandler.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const app = express();
const server = http.createServer(app);
const port = process.env.API_PORT || 4200;
const clientPort = 3001;
const clientOrigin = `http://localhost:3001`;
const corsConfig = { credentials: true, origin: clientOrigin };

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(cors(corsConfig));
app.use(
  OpenApiValidator.middleware({
    apiSpec: "./openapi.yaml",
    validateRequests: true, // (default)
    validateResponses: false, // false by default
  })
);

import { router as usersRouter } from "./routes/users.js";
app.use("/api/v1/users", usersRouter);

import { router as groupsRouter } from "./routes/groups.js";
app.use("/api/v1/groups", groupsRouter);

import { router as sessionRouter } from "./routes/session.js";
app.use("/api/v1/session", sessionRouter);

app.use((err, req, res, next) => {
  console.log(err);
  // error is from express-oauth2-jwt-bearer middleware
  if (err instanceof UnauthorizedError) {
    const formattedError = {
      path: req.originalUrl,
      message: "auth error",
      detail: err.message,
    };
    const errors = [formattedError];
    res.status(err.status).json({ errors: errors });
  }
  // error is from openapi-validator-middleware
  else if (err instanceof HttpError) {
    const errors = err.errors.map((error) => ({
      path: req.originalUrl,
      message: `${error.path} not valid`,
      detail: `${error.message}`,
    }));
    res.status(err.status).json({ errors: errors });
  }
  // custom business error
  else if (err instanceof BusinessError) {
    const formattedError = {
      path: req.originalUrl,
      message: err.message,
      detail: err.detail,
    };
    const errors = [formattedError];
    res.status(err.status).json({ errors: errors });
  }
  // system error
  else {
    const formattedError = {
      path: req.originalUrl,
      message: "system error",
      detail: "unknown system error",
    };
    const errors = [formattedError];
    res.status(500).json({ errors: errors });
  }
});

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.spyuocj.mongodb.net/${process.env.DB_DATABASE}?w=majority`;
await mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const io = new Server(server, { cors: corsConfig });
io.use(wrap(checkJwt));

io.use(async (socket, next) => {
  console.log(
    socket.request.auth.payload["https://example.com/email"],
    "connected"
  );
  const userId = socket.request.auth.payload["https://example.com/_id"];
  if (!userId) {
    next(new Error("user id not found"));
    return;
  }

  console.log("joining own user room", userId);
  socket.join(userId);

  const user = await userModel.findById(userId).populate("groups");
  if (user && user.groups) {
    user.groups.forEach((group) => {
      console.log("user", userId, "joining group room", group.group.toString());
      socket.join(group.group.toString());
    });
  }
  next();
});

io.on("connection", async (socket) => {
  console.log("connected", socket.id);
  socket.use((event, next) => {
    console.log("received event", event);
    next();
  });

  //socket.use(validatePayloadByEvent);
  videoCallHandler(io, socket);
  messagingHandler(io, socket);
  groupHandler(io, socket);

  socket.on("disconnecting", () => {
    console.log("disconnecting", socket.id);
    if (socket.callRoom) {
      socket.to(socket.callRoom).emit("userDisconnected", socket.id);
      leaveCall(io, socket);
    }
  });
  socket.on("connect_error", (err) => {
    console.log("connect_error:", err.message); // prints the message associated with the error
  });
  socket.on("error", ([err, callback]) => {
    console.log("socket error: ", err);
    if (callback) {
      callback(err);
    }
  });
});

server.listen(port, () => console.log(`Server listening on port ${port}`));
