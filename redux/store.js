import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistCombineReducers,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { campsitesReducer } from "../features/campsites/campsitesSlice";
import { commentsReducer } from "../features/comments/commentsSlice";
import { favoritesReducer } from "../features/favoritesSlice";
import { partnersReducer } from "../features/partners/partnersSlice";
import { promotionsReducer } from "../features/promotions/promotionsSlice";

const config = {
  key: "root",
  storage: AsyncStorage,
  debug: true,
};

export const store = configureStore({
  reducer: persistCombineReducers(config, {
    campsites: campsitesReducer,
    comments: commentsReducer,
    favorites: favoritesReducer,
    partners: partnersReducer,
    promotions: promotionsReducer,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
