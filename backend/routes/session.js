import express, { json } from "express";
import { checkJwt } from "../middlewares/auth.js";
import { BusinessError } from "../errors/BusinessError.js";
import userModel from "../models/userModel.js";
export const router = express.Router();

router.get("/", checkJwt, async (req, res, next) => {
    try {
     const userId = req.auth.payload["https://example.com/_id"];
     if (!userId) {
       throw new Error("auth0 not setting id in token");
     }
     res.json({userId: userId});
   } catch (err) {
     next (err);
   }
});