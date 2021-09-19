import mongoose from "mongoose";

const Schema = mongoose.Schema;
const chatSchema = new Schema({
  users: [String],
  messages: [Object],
});
const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
