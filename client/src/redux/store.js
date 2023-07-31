import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import favouriteSlice from "./favouriteSlice";
import boardSlice from "./boardSlice";
import loaderSlice from "./loaderSlice";
import modeSlice from "./modeSlice";


export const store = configureStore({
    reducer: {
        user: userSlice,
        board: boardSlice,
        favourite: favouriteSlice,
        loader: loaderSlice,
        mode: modeSlice,
    }
})