import { createDraftSafeSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'renderer/store';

export interface MainLayoutState {
  authToken?: string;
}

const initialState: MainLayoutState = {
  authToken: undefined,
}

export const mainLayoutSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string | undefined>) => {
      state.authToken = action.payload;
    },
  },
})

export const isAuthenticated = createDraftSafeSelector(
  (state: RootState) => state.mainLayoutReducer,
  (state) => !!state.authToken
)

// Action creators are generated for each case reducer function
export const { setAuthToken } = mainLayoutSlice.actions

export default mainLayoutSlice.reducer