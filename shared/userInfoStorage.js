import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const USER_INFO_KEY = "userinfo";

const canUseLocalStorage = () =>
  Platform.OS === "web" && typeof window !== "undefined" && window.localStorage;

export const getUserInfo = async () => {
  const storedUserInfo = canUseLocalStorage()
    ? window.localStorage.getItem(USER_INFO_KEY)
    : await SecureStore.getItemAsync(USER_INFO_KEY);

  return storedUserInfo ? JSON.parse(storedUserInfo) : null;
};

export const setUserInfo = async (userInfo) => {
  const serializedUserInfo = JSON.stringify(userInfo);

  if (canUseLocalStorage()) {
    window.localStorage.setItem(USER_INFO_KEY, serializedUserInfo);
    return;
  }

  await SecureStore.setItemAsync(USER_INFO_KEY, serializedUserInfo);
};
