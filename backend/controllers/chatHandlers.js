import Chat from "../models/chats.js";

export const sendHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await Chat.findById(id);
    res.status(200).json(history.messages);
  } catch (error) {
    res.json({ error });
  }
};
