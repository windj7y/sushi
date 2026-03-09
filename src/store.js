import { configureStore } from "@reduxjs/toolkit";
import msgReducer from "./slices/msgSlice";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    msg: msgReducer,
    cart: cartReducer
  }
})