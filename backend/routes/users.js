import express, { json } from "express";
import { checkJwt } from "../middlewares/auth.js";
import { BusinessError } from "../errors/BusinessError.js";
import userModel from "../models/userModel.js";
import { get, mongoose } from "mongoose";

import {
  getFileName,
  pfpBucket,
  uploadHandler,
} from "../googleCloudHelpers.js";
import uuid4 from "uuid4";
import { Db } from "mongodb";
import e from "express";

export const router = express.Router();

export function formatSimpleUser(user) {
  return {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    phoneNumber: user.phoneNumber,
    bio: user.bio,
  };
}

function userNotFoundError(userId) {
  return new BusinessError({
    status: 404,
    message: "user not found",
    detail: `user with id ${userId} not found`,
  });
}

function eventNotFoundError(eventId) {
  return new BusinessError({
    status: 404,
    message: "event not found",
    detail: `event with id ${eventId} not found`,
  });
}

export async function getUser(userId) {
  if (!mongoose.isValidObjectId(userId))
    throw new BusinessError({
      status: 400,
      message: "invalid userId",
      detail: "userId is not a valid mongo ObjectId",
    });
  const userModelData = await userModel.findById(userId);
  if (!userModelData) {
    throw userNotFoundError(userId);
  }
  return userModelData;
}

// fetches a user from userId then returns the value associated with the key from key
// if the key does not exist in the document then it returns an empty object
async function getUserProperty(userId, key) {
  const userModelData = await userModel.findById(userId);
  if (!userModelData) {
    throw userNotFoundError(userId);
  }
  return { [key]: userModelData[key] };
}

function isUser(req, userId) {
  return getUserId(req) === userId;
}

export function getUserId(req) {
  return req.auth.payload["https://example.com/_id"];
}

// replaces the document with the requested id in the database and returns the updated version of it
async function replaceUserProperty(req, key, value) {
  const userId = req.params.id;
  if (!value) {
    throw new BusinessError({
      status: 400,
      message: "bad request",
      detail: `request body must contain a ${key} field`,
    });
  }
  if (!isUser(req, userId)) {
    throw new BusinessError({
      status: 403,
      message: "invalid permissions to edit user",
      detail: `you are not authorized to update this user`,
    });
  }
  const oldUser = await userModel.findByIdAndUpdate(
    userId,
    { $set: { [key]: value } },
    { new: false, upsert: false }
  );
  if (!oldUser) {
    throw userNotFoundError(userId);
  }
  console.log("user exists");
  // return 204 No Content status code for update, 201 Created for create
  return oldUser[key] ? 204 : 201;
}

router.get("/:id/username", async (req, res, next) => {
  try {
    const key = "username";
    const username = await getUserProperty(req.params.id, key);
    res.status(200).json(username);
  } catch (err) {
    next(err);
  }
});

router.put("/:id/username", checkJwt, async (req, res, next) => {
  try {
    const key = "username";
    const status = await replaceUserProperty(req, key, req.body[key]);
    res.sendStatus(status);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/email", async (req, res, next) => {
  try {
    const key = "email";
    const email = await getUserProperty(req.params.id, key);
    res.status(200).json(email);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/phoneNumber", async (req, res, next) => {
  try {
    const key = "phoneNumber";
    const phoneNumber = await getUserProperty(req.params.id, key);
    res.status(200).json(phoneNumber);
  } catch (err) {
    next(err);
  }
});

router.put("/:id/phoneNumber", checkJwt, async (req, res, next) => {
  try {
    const key = "phoneNumber";
    const status = await replaceUserProperty(req, key, req.body[key]);
    res.sendStatus(status);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/bio", async (req, res, next) => {
  try {
    const key = "bio";
    const bio = await getUserProperty(req.params.id, key);
    res.status(200).json(bio);
  } catch (err) {
    next(err);
  }
});

router.put("/:id/bio", checkJwt, async (req, res, next) => {
  try {
    const key = "bio";
    const status = await replaceUserProperty(req, key, req.body[key]);
    res.sendStatus(status);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/profilePicture", async (req, res, next) => {
  try {
    const key = "profilePicture";
    const profilePicture = await getUserProperty(req.params.id, key);
    res.status(200).json(profilePicture);
  } catch (err) {
    next(err);
  }
});

router.put("/:id/profilePicture", checkJwt, async (req, res, next) => {
  try {
    uploadHandler.single("profilePicture")(req, res, async (err) => {
      try {
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
        const imageName = req.file.originalname;
        // image name must end in .png or .jpg
        if (!imageName.match(/\.(jpg|jpeg|png)$/)) {
          throw new BusinessError({
            status: 400,
            message: "invalid file type",
            detail: "image must be a .png, .jpg, or .jpeg file",
          });
        }
        const blob = pfpBucket.file(uuid4() + imageName);
        const blobStream = blob.createWriteStream({
          resumable: false,
        });
        blobStream.on("error", (err) => {
          next(err);
        });
        blobStream.on("finish", async () => {
          // save old pfpLink to delete later
          const oldPfpLink = await getUserProperty(
            req.params.id,
            "profilePicture"
          );
          // replace pfp link in user document
          const newPfpLink = `https://storage.googleapis.com/${pfpBucket.name}/${blob.name}`;
          // could try catch replaceUserProperty and delete image in gcs if fails then rethrow throw err
          const status = await replaceUserProperty(
            req,
            "profilePicture",
            newPfpLink
          );
          // delete old pfp in gcs if successfully replaced in db
          if (oldPfpLink) {
            const oldPfpName = getFileName(oldPfpLink.profilePicture);
            // check if old pfp in case user has no pfp or default (not a gcs link)
            if (oldPfpName) await pfpBucket.file(oldPfpName).delete();
          }
          res.sendStatus(status);
        });
        blobStream.end(req.file.buffer);
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = formatSimpleUser(await getUser(userId));
    res.status(200).json(user);
    return;
  } catch (err) {
    next(err);
  }
});

/* temp get user id from email */
router.get("/email/:email", async (req, res, next) => {
  const email = req.params.email;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new BusinessError({
        status: 404,
        message: "user not found",
        detail: `user with email ${email} not found`,
      });
    }
    const userId = user._id.toString();
    res.status(200).json(userId);
    return;
  } catch (err) {
    next(err);
  }
});

router.get("/:id/status", async (req, res, next) => {
  try {
    const key = "status";
    const status = await getUserProperty(req.params.id, key);
    res.status(200).json(status);
  } catch (err) {
    next(err);
  }
});

router.put("/:id/status", checkJwt, async (req, res, next) => {
  try {
    const key = "status";
    const status = await replaceUserProperty(req, key, req.body[key]);
    res.sendStatus(status);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  // TODO add pagination (can copy mongoose pagination code from getMessages)
  try {
    const users = await userModel.find();
    const formatted = users.map((user) => {
      return formatSimpleUser(user);
    });
    res.status(200).json({ users: formatted });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/calendar/events", async (req, res, next) => {
  try {
    const user = await getUser(req.params.id);
    const events = user.calendar ? user.calendar.events : [];
    res.status(200).json({ events: events });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/calendar/events", checkJwt, async (req, res, next) => {
  try {
    if (req.body.startTimestamp > req.body.endTimestamp) {
      throw new BusinessError({
        status: 400,
        message: "invalid time range",
        detail: "start time must be before end time",
      });
    }
    const userId = req.params.id;
    if (userId !== req.auth.payload["https://example.com/_id"]) {
      throw new BusinessError({
        status: 403,
        message: "not signed in",
        detail: `must be signed in as user with ${req.params.id}`,
      });
    }
    // find events that exists in same time period as new event
    const existingEvents = await userModel.find({
      _id: userId,
      "calendar.events": {
        $elemMatch: {
          $or: [
            {
              startTimestamp: {
                $gte: req.body.startTimestamp,
                $lte: req.body.endTimestamp,
              },
            },
            {
              endTimestamp: {
                $gte: req.body.startTimestamp,
                $lte: req.body.endTimestamp,
              },
            },
          ],
        },
      },
    });
    if (existingEvents && existingEvents.length > 0) {
      throw new BusinessError({
        status: 409,
        message: "event time conflict",
        detail: `there is already an events scheduled in this time: ${existingEvents}`,
      });
    }

    const event = {
      name: req.body.name,
      startTimestamp: req.body.startTimestamp,
      endTimestamp: req.body.endTimestamp,
      color: req.body.color,
    };
    const user = await userModel
      .findByIdAndUpdate(
        userId,
        { $push: { "calendar.events": event } },
        { new: true }
      )
      .populate("calendar.events");
    if (!user) {
      throw userNotFoundError(userId);
    }
    const resEvent = user.calendar.events[user.calendar.events.length - 1];
    res.status(200).json(resEvent);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/calendar/events/:eventId", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const eventId = req.params.eventId;

    const user = await getUser(userId);
    const events = user.calendar ? user.calendar.events : [];
    const event = events.find((event) => event._id.toString() === eventId);
    if (!event) {
      throw eventNotFoundError(eventId);
    }

    res.status(200).json(event);
  } catch (err) {
    next(err);
  }
});

router.delete(
  "/:id/calendar/events/:eventId",
  checkJwt,
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const eventId = req.params.eventId;

      if (userId !== req.auth.payload["https://example.com/_id"]) {
        throw new BusinessError({
          status: 403,
          message: "not signed in",
          detail: `must be signed in as user with ${req.params.id}`,
        });
      }

      const user = await getUser(userId);
      const events = user.calendar ? user.calendar.events : [];
      const event = events.find((event) => event._id.toString() === eventId);
      if (!event) {
        throw eventNotFoundError(eventId);
      }

      await userModel.updateOne(
        { _id: userId },
        { $pull: { "calendar.events": { _id: eventId } } }
      );
      console.log("Event deleted successfully.");

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/:id/calendar/events/:eventId/name", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const eventId = req.params.eventId;

    const user = await getUser(userId);
    const events = user.calendar ? user.calendar.events : [];
    const event = events.find((event) => event._id.toString() === eventId);
    if (!event) {
      throw eventNotFoundError(eventId);
    }

    res.status(200).json({ name: event.name });
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:id/calendar/events/:eventId/name",
  checkJwt,
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const eventId = req.params.eventId;
      const updatedEventName = req.body.name;

      if (userId !== req.auth.payload["https://example.com/_id"]) {
        throw new BusinessError({
          status: 403,
          message: "not signed in",
          detail: `must be signed in as user with ${req.params.id}`,
        });
      }

      const user = await getUser(userId);
      const event = user.calendar.events.id(eventId);
      if (!event) {
        throw eventNotFoundError(eventId);
      }
      const update = {
        $set: {
          "calendar.events.$[event].name": updatedEventName,
        },
      };

      const options = {
        arrayFilters: [{ "event._id": new mongoose.Types.ObjectId(eventId) }],
        new: true, // Return the updated user document
      };

      const updatedUser = await userModel.findOneAndUpdate(
        { _id: user._id },
        update,
        options
      );

      if (!updatedUser) {
        throw new Error("user and event found but user not updated somehow");
      }

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/:id/calendar/events/:eventId/color", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const eventId = req.params.eventId;

    const user = await getUser(userId);
    const events = user.calendar ? user.calendar.events : [];
    const event = events.find((event) => event._id.toString() === eventId);
    if (!event) {
      throw eventNotFoundError(eventId);
    }

    res.status(200).json({ color: event.color });
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:id/calendar/events/:eventId/color",
  checkJwt,
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const eventId = req.params.eventId;
      const updatedEventColor = req.body.color;

      if (userId !== req.auth.payload["https://example.com/_id"]) {
        throw new BusinessError({
          status: 403,
          message: "not signed in",
          detail: `must be signed in as user with ${req.params.id}`,
        });
      }

      const user = await getUser(userId);
      const event = user.calendar.events.id(eventId);
      if (!event) {
        throw eventNotFoundError(eventId);
      }
      const update = {
        $set: {
          "calendar.events.$[event].color": updatedEventColor,
        },
      };

      const options = {
        arrayFilters: [{ "event._id": new mongoose.Types.ObjectId(eventId) }],
        new: true, // Return the updated user document
      };

      const updatedUser = await userModel.findOneAndUpdate(
        { _id: user._id },
        update,
        options
      );

      if (!updatedUser) {
        throw new Error("user and event found but user not updated somehow");
      }

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);
