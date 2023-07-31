import { atom, selector } from "recoil";

export const isLoggedInState = atom({
  key: "isLoggedInState",
  default: false,
});

// 엑세스 토큰 atom 생성
export const accessTokenState = atom({
  key: "accessTokenState",
  default: null,
});

export const showTaxiState = atom({
  key: "showTaxiState",
  default: false,
});
export const showCarpoolState = atom({
  key: "showCarpoolState",
  default: false,
});
export const TaxiWritingState = atom({
  key: "TaxiWritingState",
  default: false,
});
export const CarpoolWritingState = atom({
  key: "CarpoolWritingState",
  default: false,
});
export const isMapLoadingState = atom({
  key: "isMapLoadingState",
  default: false,
});
export const getLocationState = atom({
  key: "getLocationState",
  default: {
    latitude: null,
    longitude: null,
  },
});
export const taxiDataState = atom({
  key: "taxiDataState",
  default: [],
});
export const carpoolDataState = atom({
  key: "carpoolDataState",
  default: [],
});
