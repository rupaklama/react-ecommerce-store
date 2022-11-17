import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Basket } from "../../app/models/basket";

interface BasketState {
  basket: Basket | null;
  status: string;
}

const initialState: BasketState = {
  basket: null,
  status: "idle",
};

/* Fetch Async Function inside of Redux Store, <Basket, void, {}> - Basket & Object type */
// note - createAsyncThunk<void, void, {}> is a 'void' function by default
// note - first arg is what we are returning from this method <Basket> type,
// second arg is argument type this method takes - payload creator
export const addBasketItemAsync = createAsyncThunk<Basket, { productId: number; quantity: number }>(
  // name or typePrefix
  "basket/addBasketItemAsync",

  // payload creator - async function to make api request
  // note - thunkAPI is available from createAsyncThunk to handle errors
  async ({ productId, quantity = 1 }, thunkAPI) => {
    try {
      return await agent.Basket.addItem(productId, quantity);
    } catch (err: any) {
      return thunkAPI.rejectWithValue({
        error: err.data,
      });
    }
  }
);

// when removing item in our api, there will be no return, therefore return type is void - first arg
export const removeBasketItemAsync = createAsyncThunk<void, { productId: number; quantity: number; name?: string }>(
  "basket/removeBasketItemAsync",

  async ({ productId, quantity }, thunkAPI) => {
    try {
      await agent.Basket.removeItem(productId, quantity);
    } catch (err: any) {
      return thunkAPI.rejectWithValue({
        error: err.data,
      });
    }
  }
);

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setBasket: (state: BasketState, action: PayloadAction<any>) => {
      state.basket = action.payload;
    },
  },

  // note - all the state updates are getting done inside here
  // Add reducers for additional action types here, and handle loading state as needed
  extraReducers: builder => {
    // note - createAsyncThunk creates an Action creator, meaning it is an Action Creator not just Async function

    // addCase() - Adds a case reducer to handle a single exact action type created by createAsyncThunk
    // eg. addBasketItemAsync.options - default options

    // Api pending
    // note - we have access to state & action inside of addCase method
    builder.addCase(addBasketItemAsync.pending, (state, action) => {
      // we can use whatever methods like in reducers above to set our state here
      // console.log(action);
      // check to see if particular item is loading
      state.status = "pendingAddItem" + action.meta.arg.productId;
      // note - attaching product id to apply loading status only to this object
    });

    // Api fulfilled
    builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
      // basket object is returning from addBasketItemAsync above
      state.basket = action.payload;
      state.status = "idle";
    });

    // Api Rejected
    builder.addCase(addBasketItemAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });

    // basket remove async function
    builder.addCase(removeBasketItemAsync.pending, (state, action) => {
      state.status = "pendingRemoveItem" + action.meta.arg.productId + action.meta.arg.name;
    });

    builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
      // destructuring payload
      const { productId, quantity } = action.meta.arg;

      const itemIndex = state.basket?.items.findIndex(i => i.productId === productId);

      if (itemIndex === -1 || itemIndex === undefined) return;

      // decrement the count
      state.basket!.items[itemIndex].quantity -= quantity;

      // item quantity = 0
      if (state.basket?.items[itemIndex].quantity === 0) state.basket.items.splice(itemIndex, 1);

      state.status = "idle";
    });

    builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
  },
});

export const { setBasket } = basketSlice.actions;

export default basketSlice.reducer;
