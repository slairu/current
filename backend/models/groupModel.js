import mongoose from "mongoose";
const { Schema } = mongoose;


const callSchema = new Schema(
  {
      startTimestamp: {
          type: Date,
          required: true,
      },
      endTimestamp: {
          type: Date,
          required: true,
      },
      audioFile: {
          type: String,
          required: true,
      },
      transcript: {
          type: String,
          required: true,
      },
  },
);

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    anouncements: {
      type: String,
      required: false,
    },
    tags: [
      {
        type: String,
      },
    ],
    private: {
      type: Boolean,
      required: true,
    },
    calls: [
      {
        type: callSchema,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Group", groupSchema);
