import axios from "axios";

const url = "https://api-greetify.herokuapp.com";

export const signUp = (account) => axios.post(`${url}/account/signup`, account);

export const signIn = (account) => axios.post(`${url}/account/login`, account);

export const saveFile = (file) => {
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  let fd = new FormData();
  fd.append("file", file);
  return axios.post(`${url}/account/save_file`, fd, config);
};

export const saveInfo = (info, id) =>
  axios.post(`${url}/account/save_info`, { info, id });

export const saveImgs = (imgs, id) =>
  axios.post(`${url}/account/save_imgs`, { imgs, id });

export const fetchProfile = (id) => axios.get(`${url}/account/${id}`);

export const fetchComps = (id) => axios.get(`${url}/account/${id}/comps`);

export const updateLocation = (data) =>
  axios.post(`${url}/account/location`, data);

export const updateSettings = (settings, id) =>
  axios.post(`${url}/account/${id}/settings`, settings);

export const sendLike = (userId, likedUserId) =>
  axios.post(`${url}/account/like`, { userId, likedUserId });

export const sendRejection = (userId, rejectedUserId) =>
  axios.post(`${url}/account/reject`, { userId, rejectedUserId });

export const fetchMatches = (matches, id) =>
  axios.post(`${url}/account/matches`, { ids: matches, id });

export const fetchProfileByChatId = (chatId, accountId) =>
  axios.post(`${url}/account/chat`, { chatId, accountId });

export const fetchHistory = (id) => axios.get(`${url}/chats/${id}/history`);
