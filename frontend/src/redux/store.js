
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/redux/reducerSlice/userSlice"

 const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store
