import { createSlice } from "@reduxjs/toolkit";

const PageSlice = createSlice({
    name: "page",
    initialState: {
        page: 1,
    },
    reducers: {
        setPage: (state, {payload}) => {
            state.page = payload.page
        }
    }
})

export const { setPage } = PageSlice.actions
export default PageSlice.reducer