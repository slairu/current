import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    attachment: {
      type: String,
      required: false,
    },
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    reactions: [
      {
        reaction: {
          type: String,
          required: true,
        },
        users: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
        ],
      },
    ],
    parentMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
