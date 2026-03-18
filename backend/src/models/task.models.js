import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    completed: {
      type: Boolean,
      default: false
    },

    dueDate: {
      type: Date
    }
  },
  {
    timestamps: true // adds createdAt & updatedAt
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;