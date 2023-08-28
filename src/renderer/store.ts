import { configureStore } from '@reduxjs/toolkit'
import { twitchApi } from 'renderer/api/twitchApi'
import mainLayoutReducer from 'renderer/logic/slice'

export const store = configureStore({
  reducer: {
    [twitchApi.reducerPath]: twitchApi.reducer,
    mainLayoutReducer,
  },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware().concat(twitchApi.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch