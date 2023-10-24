import express from "express";
import { checkJwt } from "../middlewares/auth.js";
import { BusinessError } from "../errors/BusinessError.js";
import { inGroup } from "../socketEventHandlers/groupHandler.js";
import { isAdmin } from "../socketEventHandlers/groupHandler.js";
export const router = express.Router();
import uuid4 from "uuid4";

import { callBucket, uploadHandler } from "../googleCloudHelpers.js";
import groupModel from "../models/groupModel.js";

router.get("/:groupId/calls", checkJwt, async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.auth.payload["https://example.com/userId"];
    if (!inGroup(userId, groupId)) {
      throw new BusinessError({
        status: 403,
        message: "not in group",
        detail: "must be in group to get calls",
      });
    }
    // default empty array for now
    const calls =
      (await groupModel.findById(groupId).select("calls")).calls || [];
    res.status(200).json({ calls: calls });
    return;
  } catch (err) {
    next(err);
    return;
  }
});

router.post("/:groupId/calls", checkJwt, async (req, res, next) => {
  try {
    console.log(req.body);
    if (
      !isAdmin(
        req.auth.payload["https://example.com/userId"],
        req.params.groupId
      )
    ) {
      throw new BusinessError({
        status: 403,
        message: "not admin",
        detail: "must be admin to add calls",
      });
    }
    uploadHandler.single("audioFile")(req, res, async (err) => {
      try {
        req.body.callDetails = JSON.parse(req.body.callDetails);
        if (err) {
          switch (err.code) {
            case "LIMIT_UNEXPECTED_FILE":
              throw new BusinessError({
                status: 400,
                message: "invalid field name",
                detail: `field name must be "profilePicture' and must contain 1 image`,
              });
            case "LIMIT_FILE_SIZE":
              throw new BusinessError({
                status: 400,
                message: "invalid file size",
                detail: "image must be less than 1MB",
              });
            default:
              throw err;
          }
        }
        const audioName = req.file.originalname;
        // image name must end in .png or .jpg
        if (!audioName.match(/\.(mp3|webm)$/)) {
          throw new BusinessError({
            status: 400,
            message: "invalid file type",
            detail: "file must be a .mp3, or .webm file",
          });
        }
        const blob = callBucket.file(uuid4() + audioName);
        const blobStream = blob.createWriteStream({
          resumable: false,
        });
        blobStream.on("error", (err) => {
          next(err);
        });
        blobStream.on("finish", async () => {
          // push new audioFile link to group's calls array
          const newAudioLink = `https://storage.googleapis.com/${callBucket.name}/${blob.name}`;
          const group = await groupModel.findByIdAndUpdate(req.params.groupId, {
            $push: {
              calls: {
                audioFile: newAudioLink,
                startTimestamp: req.body.callDetails.startTimestamp,
                endTimestamp: req.body.callDetails.endTimestamp,
                transcript: req.body.callDetails.transcript,
              },
            },
          });
          console.log("group", group);
          console.log(req.body);
          res.sendStatus(201);
        });
        blobStream.end(req.file.buffer);
      } catch (err) {
        next(err);
      }
    });
    console.log(req.body);
  } catch (err) {
    next(err);
  }
});
