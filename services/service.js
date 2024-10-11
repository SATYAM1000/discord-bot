import axios from "axios";
export const botServices = {
  jokeGenerator: () => {
    return axios.get("https://official-joke-api.appspot.com/random_joke");
  },

  quoteGenerator: () => {
    return axios.get("https://dummyjson.com/quotes");
  },
};
