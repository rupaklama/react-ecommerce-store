import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  data: number;
  title: string;
}

const initialState: CounterState = {
  data: 42,
  title: "redux toolkit",
};

// Redux Toolkit allows us to write "mutating" logic in reducers. It
// doesn't actually mutate the state because it uses the Immer library,
// which detects changes to a "draft state" and produces a brand new immutable state based off those changes.

// createSlice function that accepts an initial state, an object full of reducer functions, and a "slice name"
// automatically generates action creators and action types that correspond to the reducers and state
export const counterSlice = createSlice({
  // unique name for our 'slice' - piece of state
  name: "Counter",
  initialState,

  // The `reducers` field lets us define reducers and generate associated action creators
  // Setting up reducers, action creators and action types at the same time
  reducers: {
    // Here the Keys are action creators
    increment: (state: CounterState, action: PayloadAction<number>) => {
      state.data += action.payload;
    },

    decrement: (state: CounterState, action: PayloadAction<number>) => {
      state.data -= action.payload;
    },
  },
});

// Note: These are NOT reducers functions above.
// These are Action Creators with the same name as reducers.
// you can change name by doing - increment: incrementAction
export const { increment, decrement } = counterSlice.actions;

// Reducer
// It is a convention to export reducer as a default export
// export default counterSlice.reducer;
