import { atom, selector } from "recoil";

export const isLoggedInState = atom({
  key: "isLoggedInState",
  default: false,
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
