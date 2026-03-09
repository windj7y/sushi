import { createSlice } from "@reduxjs/toolkit";

export const msgSlice = createSlice({
  name: 'msg',
  initialState: [],
  reducers: {
    addMsg(state, action) {
      state.push(action.payload);
    },
    removeMsg(state, action) {
      return state.filter(item => item.id !== action.payload);
    }
  }
});

export const { addMsg, removeMsg } = msgSlice.actions;

export default msgSlice.reducer;