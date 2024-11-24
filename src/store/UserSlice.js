import { createSlice } from "@reduxjs/toolkit";
const UserSlice = createSlice({
  name: "User",
  initialState: {
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    image: "",
    token: "",
    id: null
  },
  reducers: {
    modifyUser(state, action) {
        return {
            ...state,
            firstName: action.payload?.firstName,
            lastName: action.payload?.lastName,
            role: action.payload?.role,
            image: action.payload?.image,
            email: action.payload?.email,
            token: action.payload?.token,
            id: action.payload?.id,
        };
    },
    logoutUser(state, action) {
        return {
            firstName: "",
            lastName: "",
            role: "",
            image: "",
            email: "",
            token: "",
            id: null
        };
    },
  },
});
export const UserActions = UserSlice.actions;
export default UserSlice;
