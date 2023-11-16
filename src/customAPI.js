import { getCookieToken, setRefreshToken } from "./Cookies";
import axios from "axios";

// access 없음 refresh 없음 : 로그인 -> 처리
// access 없음 refresh 있음 : 갱신
// 이거 해결해야됨

export const customAPI = axios.create({
  baseURL: "https://13.124.120.175/",
});

// 요청에 대한 인터셉터
customAPI.interceptors.request.use(function (config) {
  const accessToken = sessionStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Kakao API에 대한 요청인지 확인합니다
  if (config.url.includes("dapi.kakao.com")) {
    config.headers.Authorization = `KakaoAK 6e7fd9a12cb7bd6083457dad4ad937e2`; // Replace YOUR_KAKAO_API_KEY with your actual Kakao API key
  }

  return config; // 수정된 설정(config) 반환
});

// 응답에 대한 인터셉터
customAPI.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (err) {
    const originalConfig = err.config;

    // 리프레쉬 토큰이 비정상일 시
    if (err.response && err.response.data.status === 401) {
      const refreshToken = getCookieToken();
      const accessToken = sessionStorage.getItem("accessToken");

      if (!refreshToken) {
        return Promise.reject(err);
      }

      try {
        console.log(refreshToken, accessToken);

        // // 새로운 axios 인스턴스 생성
        // const axiosInstance = axios.create();

        const response = await axios.post(
          "https://13.124.120.175/members/reissue",
          {
            accessToken: accessToken,
            refreshToken: refreshToken,
          }
        );

        if (response.data) {
          const newAccessToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken;
          sessionStorage.setItem("accessToken", newAccessToken);
          setRefreshToken(newRefreshToken);

          console.log("재생성 -> 엑세스토큰" + newAccessToken);

          // 원래의 요청을 보냅니다.
          return customAPI(originalConfig);
        }
      } catch (err) {
        window.alert("Error: " + err.message);
        console.log("토큰 갱신 error: " + err.response.data.message);
        // const t = getCookieToken();
        // const a = sessionStorage.getItem("accessToken");
        // console.log(a);
        // console.log(t);
        // if (
        //   err.response.data.message === "Refresh Token이 유효하지 않습니다." ||
        //   err.response.data.message ===
        //     "로그아웃된 사용자입니다. Refresh Token이 존재하지 않습니다." ||
        //   err.response.data.message ===
        //     "Refresh Token이 일치하지 않거나 만료되었습니다." ||
        //   err.response.data.message === "Access Token이 만료되었습니다."
        // ) {
        //   window.location.href = "http://localhost:3000/login";
        // }
      }

      return Promise.reject(err);
    }
    return Promise.reject(err);
  }
);
