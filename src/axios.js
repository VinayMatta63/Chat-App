import axios from "axios";

const instance = axios.create({
  baseURL: "https://whats-clone-back.herokuapp.com",
});

export default instance;
