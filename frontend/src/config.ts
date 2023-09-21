// routes
import { PATH_PAGE } from './routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = process.env.REACT_APP_HOST_API_KEY || '';

export const MAIN_API = {
  // base_url: "https://tictactokens.django.nftyarcade.io/",
  base_url: "http://localhost:8080/"
  // base_url: "http://192.168.1.226:8080/",
};

// ROOT PATH AFTER LOGIN SUCCESSFUL
// ----------------------------------------------------------------------
export const PATH_AFTER_LOGIN = PATH_PAGE.home;