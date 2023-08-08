import { getCookieToken, setRefreshToken } from "./Cookies";
import axios from "axios";

export const customAPI = axios.create({
  baseURL: "http://localhost:8080/",
});

customAPI.interceptors.request.use(function (config) {
  const refreshToken = getCookieToken();

  config.headers.common["Authorization"] = refreshToken;
});

customAPI.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (err) {
    const originalConfig = err.config;

    if (err.response && err.response.data.status === 401) {
      try {
        const refreshToken = getCookieToken();
        const accessToken = sessionStorage.getItem("accessToken");

        const response = axios.post("http://localhost:8080/member/reissue", {
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

        if (response.data) {
          const { newAccessToken, newRefreshToken } = response.data;
          sessionStorage.setItem("accessToken", newAccessToken);
          setRefreshToken(newRefreshToken);
        }
        return customAPI.request(originalConfig);
      } catch (err) {
        console.log("토큰 갱신 error: " + err.response);
      }
      return Promise.reject(err);
    }
    return Promise.reject(err);
  }
);
