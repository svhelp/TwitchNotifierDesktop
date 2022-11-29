import { configureStore } from '@reduxjs/toolkit'
import { sftApi } from 'api/sftApi'
import mainLayoutReducer from 'components/logic/slice'

export const store = configureStore({
  reducer: {
    [sftApi.reducerPath]: sftApi.reducer,
    mainLayoutReducer,
  },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware().concat(sftApi.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch