import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import favouriteSlice from "./favouriteSlice";
import boardSlice from "./boardSlice";
import loaderSlice from "./loaderSlice";


export const store = configureStore({
    reducer: {
        user: userSlice,
        board: boardSlice,
        favourite: favouriteSlice,
        loader: loaderSlice
    }
})