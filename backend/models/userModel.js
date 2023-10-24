import mongoose from "mongoose";
const { Schema } = mongoose;

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  startTimestamp: {
    type: Date,
    required: true,
  },
  endTimestamp: {
    type: Date,
    required: true,
  },
  color: {
    type: String,
    validate: {
      validator: function (v) {
        return /^#([0-9a-f]{3}){1,2}$/.test(v);
      },
    },
    required: true,
  },
});

const calendarSchema = new Schema(
  {
    events: [eventSchema],
  },
  { timestamps: true }
);

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },
  bio: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  groups: [
    {
      group: {
        type: Schema.Types.ObjectId,
        ref: "Group",
        required: true,
      },
      roles: [
        {
          type: String,
          enum: ["member", "admin"],
          required: true,
        },
      ],
      lastReadMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    },
  ],
  calendar: {
    type: calendarSchema,
    required: false,
  },
  status: {
    type: String,
    enum: ["online", "offline", "away", "busy", "do not disturb", "invisible"],
    required: true,
  },
});

export default mongoose.model("User", userSchema);
