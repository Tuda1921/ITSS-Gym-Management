import mongoose from "mongoose";

const gymRoomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: String,
  capacity: Number,
  description: String
}, { timestamps: true });

export const gymRoomModel = mongoose.models.GymRoom || mongoose.model("GymRoom", gymRoomSchema); 