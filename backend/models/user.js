import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: { type: String, unique: false },
  hash: { type: String, unique: false },
  imgs: [String],
  matches: [String],
  first: String,
  last: String,
  age: Number,
  gender: String,
  looking: String,
  distance: Number,
  ageRange: { maxx: Number, minn: Number },
  bio: String,
  coords: { lat: Number, lon: Number },
  likes: [],
  matches: [],
  rejected: [],
});
const User = mongoose.model("User", userSchema);
export default User;
