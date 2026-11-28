// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers';
import { overlayMiddleware } from '../middleware/overlayMiddleware';

/*
const store = configureStore({
  reducer: rootReducer,
  // Redux Toolkit automatically adds redux-thunk middleware!
});
*/

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for the serializable check
        ignoredActions: ['SHOW_DIALOG'],
        // Ignore these field paths in the state
        ignoredPaths: ['dialog.onConfirm'],
      },
    }).concat(overlayMiddleware),
});

export default store;