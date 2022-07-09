import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

/**
 Redux Toolkit's createEntityAdapter API provides a standardized way to store your data 
 in a slice by taking a collection and putting it into the shape of { ids: [], entities: {} }. 
 Along with this predefined state shape, it generates a set of Reducer functions and 
 Selectors that know how to work with the data. 
 */

// note - storing Product data in a slice to optimize rendering data
const productsAdapter = createEntityAdapter<Product>();

// async thunk to get list of products
export const fetchProductsAsync = createAsyncThunk<Product[]>("catalog/fetchProductsAsync", async () => {
  try {
    return await agent.Catalog.list();
  } catch (err) {
    console.error(err);
  }
});

// single product
export const fetchProductAsync = createAsyncThunk<Product, number>(
  "catalog/fetchProductAsync",
  async productId => {
    try {
      return await agent.Catalog.details(productId);
    } catch (err) {
      console.error(err);
    }
  }
);

// Catalog slice to store Product data
export const catalogSlice = createSlice({
  name: "catalog",
  // note - inside of productsAdapter, we get a method to create our initial state
  initialState: productsAdapter.getInitialState({
    // getInitialState returns initial state for our Product
    productsLoaded: false,
    status: "idle",
  }),
  reducers: {},

  // since we have async thunk api call above - fetchProductsAsync
  extraReducers: builder => {
    // products
    builder.addCase(fetchProductsAsync.pending, state => {
      state.status = "pendingFetchProducts";
    });

    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      // using productsAdapter methods to work with our Product Array
      // setAll is to set all of the Products when we received from our api
      // note - first arg - state, second arg entities - list of products
      productsAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.productsLoaded = true;
    });

    builder.addCase(fetchProductsAsync.rejected, state => {
      state.status = "idle";
    });

    // product
    builder.addCase(fetchProductAsync.pending, state => {
      state.status = "pendingFetchProduct";
    });

    builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
      // upsertOne is to upsert(update or add) a new product into our products list
      productsAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });

    builder.addCase(fetchProductAsync.rejected, state => {
      state.status = "idle";
    });
  },
});

// Note - entity adapter provides a selector factory that generates
// the most common Selectors for our store data in Catalog Slice
export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);

// now we can use productSelectors to get data from our store
