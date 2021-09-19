import User from "../models/user.js";
import Chat from "../models/chats.js";
import bcrypt from "bcrypt";
import { distanceTo } from "geolocation-utils";

export const signup = async (req, res) => {
  try {
    const saltRounds = 10;
    const exists = await User.find({ email: req.body.email });
    if (exists[0]) res.json("");
    else
      bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
        if (err) console.log(err);
        else {
          const user = new User({
            email: req.body.email,
            hash,
            coords: req.body.coords,
          });
          const saved = await user.save();
          res.status(200).json(saved);
        }
      });
  } catch (error) {
    console.log(error);
    res.json("");
  }
};

export const signin = async (req, res) => {
  try {
    const exists = await User.find({ email: req.body.email });
    if (!exists[0]) res.json("");
    else {
      const user = await User.findOne({ email: req.body.email });
      bcrypt.compare(req.body.password, user.hash, (err, result) => {
        if (err) console.log(err);
        else if (result) res.status(200).json(user);
        else res.json("");
      });
    }
  } catch (error) {
    console.log(error);
    res.json("");
  }
};

export const saveInfo = async (req, res) => {
  try {
    const saved = await User.updateOne(
      { _id: req.body.id },
      {
        first: req.body.info.first,
        last: req.body.info.last,
        age: req.body.info.age,
        gender: req.body.info.gender,
        looking: req.body.info.looking,
        bio: req.body.info.bio,
        distance: 100,
        ageRange: { maxx: 26, minn: 18 },
      }
    );
    res.status(200).json(saved);
  } catch (error) {
    res.json({ error });
  }
};

export const saveImgs = async (req, res) => {
  try {
    const saved = await User.updateOne(
      { _id: req.body.id },
      {
        imgs: req.body.imgs,
      }
    );
    const user = await User.findOne({ _id: req.body.id });
    res.status(200).json(user);
  } catch (error) {
    res.json({ error });
  }
};

export const profileInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    res.json(user);
  } catch (error) {
    res.json({ error });
  }
};

export const sendComps = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    const comps = await User.find({
      gender: user.looking,
      looking: user.gender,
      age: { $gte: user.ageRange.minn, $lte: user.ageRange.maxx },
      _id: { $ne: user._id },
    });
    for (let i = 0; i < comps.length; ++i) {
      const dist = Math.floor(
        distanceTo(
          { lat: user.coords.lat, lon: user.coords.lon },
          { lat: comps[i].coords.lat, lon: comps[i].coords.lon }
        ).toFixed(0) / 1000
      );
      if (dist > user.distance) {
        comps.splice(i, 1);
        i -= 1;
      } else if (
        user.likes.includes(comps[i]._id) ||
        user.rejected.includes(comps[i]._id)
      ) {
        comps.splice(i, 1);
        i -= 1;
      }
    }

    res.json(comps);
  } catch (error) {
    res.json({ error });
  }
};

export const updateLocation = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.id, {
      coords: { lat: req.body.lat, lon: req.body.lon },
    });
    res.status(200);
  } catch (error) {
    res.json({ error });
  }
};

export const saveSettings = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, {
      distance: req.body.distance,
      ageRange: {
        minn: req.body.age.minn,
        maxx: req.body.age.maxx,
      },
      looking: req.body.looking,
    });
    const saved = await User.findById(id);
    res.status(200).json(saved);
  } catch (error) {
    res.json({ error });
  }
};

export const addLike = async (req, res) => {
  try {
    const { userId, likedUserId } = req.body;
    const likedUser = await User.findById(likedUserId);
    if (likedUser.likes.includes(userId)) {
      const chat = await new Chat({ users: [userId, likedUserId] });
      await chat.save();
      await User.findByIdAndUpdate(likedUserId, {
        $push: { matches: userId },
      });
      const user = await User.findByIdAndUpdate(userId, {
        $push: { likes: likedUserId, matches: likedUserId },
      });
      res.status(200).json("matched");
    } else {
      await User.findByIdAndUpdate(userId, { $push: { likes: likedUserId } });
      res.status(200).json("liked");
    }
  } catch (error) {
    res.json({ error });
  }
};

export const addRejection = async (req, res) => {
  try {
    const { userId, rejectedUserId } = req.body;
    await User.findByIdAndUpdate(userId, {
      $push: { rejected: rejectedUserId },
    });
    res.status(200).json("rejected");
  } catch (error) {
    res.json({ error });
  }
};

export const sendMatches = async (req, res) => {
  try {
    const { ids, id } = req.body;
    let matches = { users: [], chats: [] };
    for (let id of ids) {
      const match = await User.findById(id);
      matches.users.push(match);
    }
    const chats = await Chat.find({ users: id });
    matches.chats = chats;
    res.status(200).json(matches);
  } catch (error) {
    res.json({ error });
  }
};

export const sendProfile = async (req, res) => {
  try {
    const { chatId, accountId } = req.body;
    const chat = await Chat.findById(chatId);
    let user;
    for (let _user of chat.users)
      if (_user !== accountId) user = await User.findById(_user);
    res.status(200).json(user);
  } catch (error) {
    res.json({ error });
  }
};
